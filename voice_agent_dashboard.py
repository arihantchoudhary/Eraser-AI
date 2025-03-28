import streamlit as st
import speech_recognition as sr
import pyttsx3
import os
from dotenv import load_dotenv
import openai
import json

# Load environment variables
load_dotenv()

# Initialize OpenAI client
client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

# Initialize speech recognition and text-to-speech engines
recognizer = sr.Recognizer()
engine = pyttsx3.init()

def text_to_speech(text):
    """Convert text to speech"""
    try:
        engine.say(text)
        engine.runAndWait()
    except Exception as e:
        st.error(f"Error in text-to-speech: {str(e)}")

def speech_to_text(audio_data):
    """Convert speech to text"""
    try:
        text = recognizer.recognize_google(audio_data)
        return text
    except sr.UnknownValueError:
        return "Could not understand audio"
    except sr.RequestError as e:
        return f"Could not request results; {str(e)}"

def get_ai_response(prompt):
    """Get response from OpenAI"""
    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful AI assistant."},
                {"role": "user", "content": prompt}
            ]
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Error getting AI response: {str(e)}"

def main():
    st.title("Voice Agent Dashboard")
    st.write("Interact with AI using voice commands")

    # Initialize session state for conversation history
    if 'conversation' not in st.session_state:
        st.session_state.conversation = []

    # Voice input section
    st.header("Voice Input")
    if st.button("Start Recording"):
        with st.spinner("Recording... Speak now"):
            with sr.Microphone() as source:
                audio = recognizer.listen(source)
                text = speech_to_text(audio)
                st.write(f"You said: {text}")
                
                # Get AI response
                response = get_ai_response(text)
                st.write(f"AI: {response}")
                
                # Add to conversation history
                st.session_state.conversation.append({"user": text, "ai": response})
                
                # Convert AI response to speech
                text_to_speech(response)

    # Display conversation history
    st.header("Conversation History")
    for i, conv in enumerate(st.session_state.conversation):
        st.write(f"**You ({i+1}):** {conv['user']}")
        st.write(f"**AI ({i+1}):** {conv['ai']}")
        st.write("---")

    # Text input section
    st.header("Text Input")
    user_input = st.text_input("Type your message:")
    if st.button("Send"):
        if user_input:
            response = get_ai_response(user_input)
            st.write(f"AI: {response}")
            st.session_state.conversation.append({"user": user_input, "ai": response})
            text_to_speech(response)

    # Clear conversation button
    if st.button("Clear Conversation"):
        st.session_state.conversation = []
        st.experimental_rerun()

if __name__ == "__main__":
    main() 