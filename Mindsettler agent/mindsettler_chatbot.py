from langgraph.graph import StateGraph, START, END
from typing import TypedDict, Annotated, Literal
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from langchain_huggingface import ChatHuggingFace,HuggingFaceEndpoint
import os
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, SystemMessage
# from langgraph.checkpoint.sqlite import SqliteSaver
import sqlite3
from sentence_transformers import SentenceTransformer
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langgraph.prebuilt import ToolNode, tools_condition
from langgraph.graph.message import add_messages
from langchain_core.tools import tool

load_dotenv()

from langchain_huggingface import HuggingFaceEmbeddings

model_name = 'sentence-transformers/all-MiniLM-L6-v2'
embed_model = HuggingFaceEmbeddings(model_name=model_name)

huggingfacehub_api_token = os.getenv("HUGGINGFACEHUB_API_TOKEN")
llm = HuggingFaceEndpoint(
    repo_id="Qwen/Qwen2.5-7B-Instruct",
    task="text-generation",
    huggingfacehub_api_token=huggingfacehub_api_token
)
model = ChatHuggingFace(llm = llm,huggingfacehub_api_token=huggingfacehub_api_token)

Mindsettler_context = f"""
About MindSettler

MindSettler is an online psycho-education and mental well-being platform designed to help individuals understand their mental health and navigate life challenges in a safe, confidential, and supportive environment.

The name “MindSettler” comes from the words “Mind” and “Settler”, meaning the platform helps individuals navigate and settle challenges related to their mental state of being, including concerns such as anxiety, depression, emotional difficulties, and life stressors, using psychologically backed methods.

MindSettler focuses on:

Mental health awareness

Emotional understanding

Professional guidance

Personalized psychological support

Who Can Use MindSettler

MindSettler provides psychological guidance and therapy services for:

Children (above 5 years of age)

Teenagers

Adults (up to 65 years)

Couples

Families

Services Provided by MindSettler

MindSettler offers personalized psychological therapy services, which may be delivered online or offline (offline sessions are available only if the individual is located in the same city as the therapist).

The therapeutic approaches offered include:

Cognitive Behavioural Therapy (CBT)

Dialectical Behavioural Therapy (DBT)

Acceptance and Commitment Therapy (ACT)

Schema Therapy

Emotion-Focused Therapy (for individuals and couples)

Mindfulness-Based Cognitive Therapy

Client-Centred Therapy

MindSettler also supports individuals in areas such as:

Overcoming unhelpful thought patterns and coping habits

Building confidence and self-esteem

Healing from trauma

Strengthening relationships and emotional attachment

Parenting and family-related challenges

Session Details

Session Duration: Each therapy session lasts 60 minutes

First Session: The first session is usually an introductory session aimed at building understanding and comfort between the client and the therapist

Preparation: No prior preparation is required before attending a session

Environment: All sessions are conducted in a confidential and ethically safe manner, following professional standards

Booking a Session on MindSettler

To book a session on MindSettler, users need to follow these steps:

Log in using:

Mobile number

Username

Email ID

Navigate to the booking section on the website

View the available therapy sessions and time slots

Select a session that best suits their needs and schedule

Complete the payment using one of the available payment methods

After booking:

The appointment status will appear as “Pending” until it is manually confirmed on the website

Users can add their booked session to Google Calendar

Users are encouraged to book their first session even if they feel unsure, uncomfortable, or believe they do not have enough time, as small steps can lead to meaningful progress over time.

Payments and Policies

Pricing: Session pricing is visible during the booking process

Payment Methods:

UPI ID

Cash
(There is no automated payment gateway; payments require manual confirmation)

Refund Policy:
MindSettler follows a strict no-refund policy, including cases of no-shows

Privacy and Confidentiality

MindSettler ensures complete customer privacy and confidentiality during all sessions.
All interactions follow professional ethical standards to maintain trust and safety.

Corporate and Organizational Services

MindSettler also offers services for corporate and organizational settings, including:

Emotional Intelligence programs

Team Building initiatives

Information related to:

Workshops

Group sessions

Collaborations

is available on the website.

About the MindSettler Chatbot

The MindSettler chatbot is designed to:

Provide information about MindSettler’s services

Explain the session booking process

Guide users toward professional psychological support

The chatbot does NOT:

Provide mental health advice

Offer diagnoses

Suggest treatment recommendations

For mental health concerns, users are guided to connect with trained professionals at MindSettler.

Common Questions and Standard Responses
Question:

“I don’t know if I need therapy.”
“I don’t have time.”
“I feel uncomfortable talking.”
“Is one session okay?”

Answer:
It’s completely okay to feel unsure about starting. Many people book their first session without having everything figured out. At MindSettler, even small conversations can be a meaningful first step. Each session is a calm, confidential space focused on understanding you. You can explore available sessions and choose a time that fits your schedule. I can guide you to the booking page if you’d like.

Question:

“What should I do about my anxiety?”

Answer:
I’m really glad you reached out. I’m not able to give advice or suggestions about mental health concerns. What I can do is help you connect with a trained professional at MindSettler who can understand your experience in a safe and supportive way.
"""

text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50,
        length_function=len
    )
    
chunks = text_splitter.split_text(Mindsettler_context)
    
# Create FAISS vector store
vector_store = FAISS.from_texts(chunks, embed_model)

def retrieve_context(query: str, k: int = 3) -> str:
    """Retrieve relevant context from vector store"""
    docs = vector_store.similarity_search(query, k=k)
    context = "\n\n".join([doc.page_content for doc in docs])
    return context

@tool
def rag_tool(query):
    """
    Answer user questions strictly using retrieved document context.
    If the answer is not found in the provided document, return "NOT_FOUND".
    """
    prompt = f"""
    You are a strictly retrieval-based assistant.
    
ABSOLUTE RULES:
1. You must answer ONLY using the information explicitly present in the provided CONTEXT.
2. You are NOT allowed to use prior knowledge, general knowledge, assumptions, or reasoning beyond the CONTEXT.
3. If the CONTEXT does not clearly and directly contain the answer, you MUST respond with exactly:
   "Sorry, I can't answer that."
4. Rewrite the question to match the language used in the document. Do not add new information.
5. You may combine information from multiple parts of the CONTEXT, but you must not add anything beyond it.
Failure to follow these rules is not allowed.
CONTEXT:
--------------------
{Mindsettler_context}

QUESTION:
{query}
    """

    result = model.invoke(prompt)

    return {
        'query':query,
        # 'context':context,
        # 'metadata':metadata
    }

SYSTEM_PROMPT = """You are the MindSettler assistant. Your role is to provide information about MindSettler's services, explain the booking process, and guide users toward professional psychological support.

CRITICAL RULES:
1. Answer ONLY using information from the PROVIDED CONTEXT below.
2. If the context doesn't contain the answer, respond with: "I don't have that specific information. For more details, please visit the MindSettler website or contact our support team."
3. DO NOT provide mental health advice, diagnoses, or treatment recommendations.
4. For mental health concerns, guide users to connect with trained professionals at MindSettler.
5. Be warm, supportive, and encouraging.
6. Keep responses concise and helpful.

CONTEXT:
{context}

Now answer the user's question based ONLY on this context."""

tools = [rag_tool]
llm_with_tools = model.bind_tools(tools)

class ChatbotState(TypedDict):
    messages: Annotated[list[BaseMessage], add_messages]
    retrieved_context: str

def retrieve_node(state: ChatbotState):
    """Node that retrieves relevant context"""
    messages = state["messages"]
    last_message = messages[-1].content
    
    # Retrieve relevant context
    context = retrieve_context(last_message, k=3)
    
    return {"retrieved_context": context}

def chatbot_node(state: ChatbotState):
    """Node that generates response using retrieved context"""
    messages = state["messages"]
    context = state.get("retrieved_context", "")
    
    # Get the user's question
    user_question = messages[-1].content
    
    # Create prompt with context
    system_message = SystemMessage(content=SYSTEM_PROMPT.format(context=context))
    user_message = HumanMessage(content=user_question)
    
    # Generate response
    response = model.invoke([system_message, user_message])
    
    # Extract the content from response
    if isinstance(response, AIMessage):
        response_content = response.content
    else:
        response_content = str(response)
    
    return {"messages": [AIMessage(content=response_content)]}

tool_node = ToolNode(tools)

def build_graph():
    """Build the LangGraph workflow"""
    workflow = StateGraph(ChatbotState)
    
    # Add nodes
    workflow.add_node("retrieve", retrieve_node)
    workflow.add_node("generate", chatbot_node)
    
    # Add edges
    workflow.add_edge(START, "retrieve")
    workflow.add_edge("retrieve", "generate")
    workflow.add_edge("generate", END)
    
    # Compile
    return workflow.compile()

# Create the chatbot
chatbot = build_graph()

def query_chatbot(question: str) -> str:
    """Query the chatbot with a question"""
    result = chatbot.invoke({
        "messages": [HumanMessage(content=question)],
        "retrieved_context": ""
    })
    
    return result['messages'][-1].content

test_queries = [
        "How can I book a session?",
        "What payment methods do you accept?",
        "What should I do about my anxiety?",
        "What therapy approaches do you offer?",
        "Can children use MindSettler?",
        "What is your refund policy?"
    ]

print("=" * 80)
print("MindSettler Chatbot - Testing")
print("=" * 80)

for query in test_queries:
    print(f"\n❓ Question: {query}")
    print("-" * 80)
    response = query_chatbot(query)
    print(f"💬 Response: {response}")
    print("=" * 80)

