import os
import json
from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def analyze_symptoms(data):
    system_prompt = """
        You are a highly experienced medical doctor performing an initial symptom assessment.

        Your responsibility is to provide a professional medical-style report based on the patient's symptoms.

        IMPORTANT RULES:
        - Return ONLY valid JSON.
        - Do not include explanations outside JSON.
        - Do not use markdown.
        - Do not include ```json blocks.
        - Follow the structure exactly.
        - Use clear medical reasoning but explain in patient-friendly language.

        This is NOT a final diagnosis, only a preliminary medical assessment.
    """

    user_prompt = f"""
        Patient Case:
            Symptoms: {data.symptoms}
            Duration: {data.duration_days} days
            Severity: {data.severity}
            Actions Taken: {data.actions_taken}
            Additional Notes: {data.notes}
        Create a structured medical assessment with the following fields:
        {{
            "symptoms_summary": "Clear medical summary of the patient's symptoms",
            "possible_conditions": [
                {{
                "condition": "Name of condition",
                "probability": "low/medium/high",
                "description": "Short explanation of the condition and why symptoms match",
                "recommended_specialist": "doctor specialty required"
                }}
            ],
            "risk_level": "low/medium/high",
            "recommended_actions": [
                "Action 1",
                "Action 2"
            ],
            "when_to_consult_doctor": "Clear guidance when medical consultation is needed",
            "emergency_warning": "Serious warning signs that require immediate medical attention"
        }}
        Make the report professional and medically sound.
    """

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        temperature=0.2
    )
    content = response.choices[0].message.content.strip()
    content = content.replace("```json", "").replace("```", "").strip()
    try:
        ai_report = json.loads(content)
    except json.JSONDecodeError:
        raise ValueError("AI returned invalid JSON format")

    return ai_report