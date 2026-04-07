/**
 * Kedi Health AI Core Engine
 * Integrates Chatbot, Vector Recommendation, Clinical logic, and Emotional Intelligence
 */

// --- 1. Vector Recommendation Engine ---

window.loadProducts = async function() {
    try {
        const response = await fetch('products.json');
        return await response.json();
    } catch (e) {
        console.error("Failed to load products", e);
        return [];
    }
}

async function getVectorSimilarity(textA, textB) {
    const wordsA = textA.toLowerCase().split(/\W+/);
    const wordsB = textB.toLowerCase().split(/\W+/);
    const intersection = wordsA.filter(w => wordsB.includes(w));
    return intersection.length / Math.max(wordsA.length, wordsB.length);
}

window.recommendProducts = async function(symptoms) {
    const products = await loadProducts();
    const recommendations = [];
    const query = Array.isArray(symptoms) ? symptoms.join(" ") : symptoms;

    for (const product of products) {
        let maxScore = 0;
        const tags = product.symptom_tags || [];
        for (const tag of tags) {
            const similarity = await getVectorSimilarity(query, tag);
            if (similarity > maxScore) maxScore = similarity;
            if (query.toLowerCase().includes(tag.toLowerCase())) maxScore += 0.5;
        }
        const descSim = await getVectorSimilarity(query, product.description || "");
        maxScore = Math.max(maxScore, descSim * 0.8);
        if (product.is_pack) maxScore *= 1.2; 
        if (maxScore > 0.1) recommendations.push({ product, score: maxScore });
    }
    recommendations.sort((a, b) => b.score - a.score);
    return recommendations.map(r => r.product).slice(0, 5);
}

// --- 2. Advanced Clinical & Emotional Intelligence Databases ---

const medicalDatabase = {
    symptoms: {
        headache: {
            name: 'Headache',
            causes: ['stress', 'dehydration', 'migraine', 'sinus', 'eye_strain', 'caffeine_withdrawal'],
            severity: ['mild', 'moderate', 'severe'],
            advice: 'Rest in a dark, quiet room. Stay hydrated. Avoid screens. Apply cold compress.',
            redFlags: ['fever', 'stiff neck', 'confusion', 'vision changes', 'difficulty speaking']
        },
        stomach: {
            name: 'Stomach Issues',
            causes: ['indigestion', 'food_poisoning', 'gastritis', 'ibs', 'stress'],
            severity: ['mild', 'moderate', 'severe'],
            advice: 'Eat bland foods. Avoid spicy, fatty foods. Stay hydrated. Consider probiotics.',
            redFlags: 'Severe pain, blood in stool, vomiting blood, high fever'
        },
        stress: {
            name: 'Stress & Anxiety',
            causes: ['work_pressure', 'relationships', 'health_concerns', 'lifestyle'],
            severity: ['mild', 'moderate', 'severe', 'panic'],
            advice: 'Practice deep breathing. Exercise regularly. Try meditation. Limit caffeine. Talk to someone.',
            redFlags: 'Suicidal thoughts, self-harm, panic attacks, inability to function'
        },
        fatigue: {
            name: 'Fatigue',
            causes: ['lack_of_sleep', 'poor_nutrition', 'anemia', 'thyroid', 'depression', 'overwork'],
            severity: ['mild', 'moderate', 'severe'],
            advice: 'Prioritize sleep (7-9 hours). Eat balanced meals. Exercise regularly. Check vitamin levels.',
            redFlags: 'Extreme fatigue lasting weeks, unexplained weight loss, shortness of breath'
        },
        sleep: {
            name: 'Sleep Disorders',
            causes: ['insomnia', 'sleep_apnea', 'restless_legs', 'stress', 'poor_habits'],
            severity: ['occasional', 'frequent', 'chronic'],
            advice: 'Maintain regular sleep schedule. Avoid screens before bed. Create dark, cool environment. Avoid caffeine late.',
            redFlags: 'Stop breathing during sleep, excessive daytime sleepiness, falling asleep while driving'
        }
    },
    conditions: {
        emergency: ['chest pain', 'difficulty breathing', 'severe bleeding', 'loss of consciousness', 'stroke symptoms', 'heart attack', 'suicide', 'kill myself']
    }
};

const emotionDatabase = {
    emotions: {
        happy: { indicators: ['happy', 'glad', 'excited', 'joyful', 'cheerful'], emoji: '😊' },
        sad: { indicators: ['sad', 'depressed', 'down', 'unhappy', 'blue'], emoji: '😔' },
        anxious: { indicators: ['anxious', 'worried', 'nervous', 'scared', 'panicked'], emoji: '😰' },
        angry: { indicators: ['angry', 'mad', 'furious', 'irritated', 'upset'], emoji: '😠' },
        tired: { indicators: ['tired', 'exhausted', 'fatigued', 'weary'], emoji: '😴' }
    },
    humor: {
        indicators: ['just kidding', 'lol', 'haha', 'funny', 'joke', 'hilarious'],
        responses: [
            'Haha! You caught me smiling! 😄',
            'I love a good sense of humor! Laughter is the best medicine!',
            'You\'re funny! I\'ll add that to my personality circuits! 🤖',
            'Ha! Even AI doctors need to laugh sometimes!'
        ]
    }
};

const healthDictionary = {
    "diabetes": ["pack-100k-diabetes"],
    "high sugar": ["pack-100k-diabetes"],
    "blood sugar": ["pack-100k-diabetes"],
    "prostate": ["pack-100k-prostate"],
    "frequent urination": ["pack-100k-prostate"],
    "hypertension": ["pack-100k-hypertension"],
    "high blood pressure": ["pack-100k-hypertension"],
    "stroke": ["pack-100k-hypertension"],
    "fibroid": ["pack-100k-fibroid-fertility"],
    "infertility": ["pack-100k-fibroid-fertility"],
    "pid": ["pack-100k-fibroid-fertility"],
    "ulcer": ["pack-100k-ulcer"],
    "stomach pain": ["pack-100k-ulcer"],
    "gastritis": ["pack-100k-ulcer"],
    "arthritis": ["pack-100k-arthritis"],
    "joint pain": ["pack-100k-arthritis"],
    "rheumatism": ["pack-100k-arthritis"]
};

// --- 3. Chatbot Core Logic ---

window.getChatBotResponse = async function(userText) {
    const lower = userText.toLowerCase();

    // 1. Emergency Check
    if (medicalDatabase.conditions.emergency.some(e => lower.includes(e))) {
        return { 
            text: "🚨 <strong>EMERGENCY DETECTED:</strong> This sounds serious. Use our site for information only. Please call emergency services or go to the nearest hospital immediately! Your safety is our priority.", 
            emoji: '🚨',
            isEmergency: true 
        };
    }

    // 2. Humor & Personality Check
    if (emotionDatabase.humor.indicators.some(h => lower.includes(h))) {
        const reply = emotionDatabase.humor.responses[Math.floor(Math.random() * emotionDatabase.humor.responses.length)];
        return { text: reply, emoji: '😄' };
    }

    // 3. Clinical Services Intent
    if (/book.*appointment|schedule.*visit|see.*doctor/.test(lower)) {
        return { text: "I have initiated an appointment request for you. Our medical concierge will contact you within the next 24 hours to finalize the schedule.", emoji: '🩺' };
    }
    
    if (/diagnose|analysis|report|check.*symptoms|evaluate/.test(lower)) {
        return { text: "For a detailed medical analysis and a severity score, I recommend using our structured <strong>Symptom Checker</strong>. It's designed for deep diagnostics.<br><br><a href='/quiz.html' class='btn btn-primary py-2 px-4 text-sm mt-2'>Start Symptom Quiz</a>", emoji: '📊' };
    }
    
    if (/whatsapp|notify.*me|text.*me/.test(lower)) {
        return { text: "Of course. I have sent a notification request to our WhatsApp channel. You should receive a greeting shortly.", emoji: '📱' };
    }

    // 4. Clinical Condition Analysis
    let botReply = ``;
    let recommendations = [];
    let clinicAnalysis = "";

    // Check Detailed Medical symptoms Database
    for (const [key, data] of Object.entries(medicalDatabase.symptoms)) {
        if (lower.includes(key)) {
            clinicAnalysis = `<div class="bg-blue-50 p-3 rounded-lg border border-blue-200 mb-4 text-sm">
                <strong>🔍 AI Clinical Analysis:</strong><br>
                Identified: ${data.name}<br>
                Common Causes: ${data.causes.slice(0,3).join(', ')}<br>
                <em>Advice: ${data.advice}</em>
            </div>`;
            break;
        }
    }

    // Check Health Challenge Packs
    let matchedPacks = [];
    for (const [condition, packs] of Object.entries(healthDictionary)) {
        if (lower.includes(condition)) matchedPacks.push(...packs);
    }

    if (matchedPacks.length > 0) {
        const allProducts = await loadProducts();
        let uniquePacks = [...new Set(matchedPacks)];
        recommendations = allProducts.filter(p => uniquePacks.includes(p.id));
        botReply += clinicAnalysis + `Because you mentioned a specific medical condition, I strongly recommend our <strong>100K Health Challenge Pack</strong> designed for a 30-day intensive treatment protocol:<br>`;
    } else {
        const words = lower.match(/\b\w+\b/g) || [];
        recommendations = await window.recommendProducts(words);
        if (recommendations.length > 0) botReply += clinicAnalysis + `Based on your symptoms, I believe these Kedi natural formulas could be beneficial:<br>`;
    }

    // Emotion Detection
    let sentimentEmoji = '⚪';
    for (const [key, data] of Object.entries(emotionDatabase.emotions)) {
        if (data.indicators.some(i => lower.includes(i))) {
            sentimentEmoji = data.emoji;
            break;
        }
    }
    if (sentimentEmoji === '⚪') {
        if (lower.includes('pain') || lower.includes('hurt')) sentimentEmoji = '😟';
        if (lower.includes('thanks') || lower.includes('good')) sentimentEmoji = '😊';
    }

    // Product Card Rendering
    if (recommendations.length > 0) {
        recommendations.forEach(p => {
            const piPrice = (p.price / 314159).toFixed(8);
            botReply += `<div class="mt-4 p-4 border rounded-xl bg-white shadow-sm flex gap-4 items-center animate-fade-in ${p.is_pack ? 'border-primary bg-teal-50' : ''}">
                            <img src="${p.image_url}" alt="${p.name}" width="60" height="60" class="rounded-lg shadow-sm border bg-white">
                            <div class="flex-1">
                                <div class="flex justify-between items-start">
                                    <strong class="text-primary font-bold">${p.is_pack ? '🌟 ' : ''}${p.name}</strong>
                                    <span class="text-sm font-semibold text-blue-600">π${piPrice}</span>
                                </div>
                                <p class="text-xs text-muted mt-1 leading-tight">${p.description}</p>
                                <button class="btn-add-cart mt-2 py-1 px-3 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition" 
                                        data-name="${p.name}" 
                                        data-price="${piPrice}" 
                                        data-image="${p.image_url}">
                                    Add to Cart
                                </button>
                            </div>
                         </div>`;
        });
        botReply += `<p class="mt-4 text-sm">Would you like me to add any of these to your health plan?</p>`;
    } else if (botReply === "") {
        botReply = `I understand. Could you please provide more details about your symptoms or feelings? I'm here to listen and help.`;
    } else if (!clinicAnalysis) {
        botReply += `<br><br>While I don't have a specific Kedi product to recommend for that query right now, I suggest maintaining hydration and monitoring your energy levels.`;
    }

    return { text: botReply, emoji: sentimentEmoji };
}

// --- 4. Clinical Class Interface ---

class KediAI {
    constructor(options = {}) {
        this.options = options;
        this.messagesArea = document.getElementById(options.messagesId || 'chat-messages');
        this.chatForm = document.getElementById(options.formId || 'chat-form');
        this.chatInput = document.getElementById(options.inputId || 'chat-input');
        
        if (this.chatForm) {
            this.chatForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        const text = this.chatInput.value.trim();
        if (!text) return;

        this.appendMessage(text, 'user');
        this.chatInput.value = '';

        const typingId = this.showTyping();

        setTimeout(async () => {
            const reply = await window.getChatBotResponse(text);
            document.getElementById(typingId).remove();
            this.appendMessage(reply.text, 'bot', reply.emoji);
        }, 1000);
    }

    appendMessage(content, sender = 'user', emoji = '') {
        if (!this.messagesArea) return;
        
        const msgDiv = document.createElement('div');
        msgDiv.className = `message message-${sender} mb-4 flex ${sender === 'user' ? 'justify-end' : 'justify-start'}`;
        const now = new Date();
        const timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

        let bubbleClass = sender === 'user' ? 'bg-primary text-white rounded-l-xl rounded-tr-xl' : 'bg-gray-100 text-gray-800 rounded-r-xl rounded-tl-xl';
        
        msgDiv.innerHTML = `
            <div class="max-w-[80%] ${bubbleClass} p-3 shadow-sm relative">
                <div class="flex items-center gap-2 mb-1">
                    ${emoji ? `<span>${emoji}</span>` : ''}
                    <span class="text-[10px] opacity-70">${sender === 'user' ? 'You' : 'Dr. Kedi AI'}</span>
                </div>
                <div class="text-sm">${content}</div>
                <div class="text-[9px] opacity-50 mt-1 text-right">${timeStr}</div>
            </div>
        `;
        
        this.messagesArea.appendChild(msgDiv);
        this.messagesArea.scrollTop = this.messagesArea.scrollHeight;
    }

    showTyping() {
        const id = 'typing-' + Date.now();
        const msgDiv = document.createElement('div');
        msgDiv.id = id;
        msgDiv.className = `message message-bot mb-4 flex justify-start`;
        msgDiv.innerHTML = `
            <div class="bg-gray-100 text-gray-500 p-3 rounded-r-xl rounded-tl-xl shadow-sm italic text-xs">
                Doctor is typing...
            </div>
        `;
        this.messagesArea.appendChild(msgDiv);
        this.messagesArea.scrollTop = this.messagesArea.scrollHeight;
        return id;
    }
}

window.KediAI = KediAI;
