(function() {
            // --- Start of Chatbot Logic ---

            // === Constants ===
            const WHATSAPP_BUSINESS_LINK = "https://wa.me/message/WNGLZNUXKXXIF1";
            // Gemini API Key (leave empty for Canvas runtime - Canvas will inject it)
            const API_KEY = "";
            const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
            const BOT_AVATAR_URL = "avatar.png"; // Placeholder bot avatar
            // Updated CHAT_ICON_IMAGE_URL for a more generic and larger placeholder
            const CHAT_ICON_IMAGE_URL = "chatbot (2).png"; // Placeholder chat icon image

            // === Data Definitions ===
            // Products Data - Reordered for specific product matching first
            const products = [{
                id: "small-reishi",
                name: "Small Reishi",
                keywords: /small reishi|small lingzhi|small ganoderma/i,
                image: "Reishi.png",
                description: "Immune-boosting and anti-fatigue properties in a smaller pack.",
                price: "₦15,000",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/WNGLZNUXKXXIF1",
                blogLink: "https://example.com/blog/small-reishi",
                qna: [{
                    question: "How often should I take Small Reishi?",
                    answer: "Typically, Small Reishi is taken once or twice daily, but always refer to the product packaging for precise dosage instructions or consult a healthcare professional."
                }, {
                    question: "Is Small Reishi good for liver health?",
                    answer: "Yes, Small Reishi is well-known for its hepatoprotective properties and can support liver function."
                }]
            }, {
                id: "reishi",
                name: "Reishi",
                keywords: /reishi|lingzhi|ganoderma/i,
                image: "Reishi.png",
                description: "Immune-boosting and anti-fatigue properties.",
                price: "₦35,000",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/WNGLZNUXKXXIF1",
                blogLink: "https://example.com/blog/reishi",
                qna: [{
                    question: "How often should I take Reishi?",
                    answer: "Typically, Reishi is taken once or twice daily, but always refer to the product packaging for precise dosage instructions or consult a healthcare professional."
                }, {
                    question: "Is Reishi good for liver health?",
                    answer: "Yes, Reishi is well-known for its hepatoprotective properties and can support liver function."
                }]
            }, {
                id: "packet-re-vive",
                name: "Packet Re-Vive",
                keywords: /packet re-vive|revive packet|small revive/i,
                image: "Revive.png",
                description: "Supports male sexual health and vitality in a convenient packet.",
                price: "₦16,000",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/WNGLZNUXKXXIF1",
                blogLink: "https://example.com/blog/packet-re-vive",
                qna: [{
                    question: "What are the main benefits of Packet Re-Vive?",
                    answer: "Packet Re-Vive primarily enhances male sexual function, increases libido, and improves overall vitality."
                }, {
                    question: "Are there any side effects of Packet Re-Vive?",
                    answer: "Generally, Packet Re-Vive is well-tolerated. For specific concerns, it's best to consult your doctor."
                }]
            }, {
                id: "re-vive",
                name: "Re-Vive",
                keywords: /re-vive|revive|sexual health male/i,
                image: "Revive.png",
                description: "Supports male sexual health and vitality.",
                price: "₦44,000",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/WNGLZNUXKXXIF1",
                blogLink: "https://example.com/blog/re-vive",
                qna: [{
                    question: "What are the main benefits of Re-Vive?",
                    answer: "Re-Vive primarily enhances male sexual function, increases libido, and improves overall vitality."
                }, {
                    question: "Are there any side effects?",
                    answer: "Generally, Re-Vive is well-tolerated. For specific concerns, it's best to consult your doctor."
                }]
            }, {
                id: "small-cordy-active",
                name: "Small Cordy Active",
                keywords: /small cordy active|small cordy/i,
                image: "Cordy Active.png",
                description: "Enhances stamina, athletic performance, and respiratory health in a smaller size.",
                price: "₦14,000",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/WNGLZNUXKXXIF1",
                blogLink: "https://example.com/blog/small-cordy-active",
                qna: []
            }, {
                id: "cordy-active",
                name: "Cordy Active",
                keywords: /cordy active|stamina|athletic performance|respiratory health/i,
                image: "Cordy Active.png",
                description: "Enhances stamina, athletic performance, and respiratory health.",
                price: "₦25,000",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/WNGLZNUXKXXIF1",
                blogLink: "https://example.com/blog/cordy-active",
                qna: []
            }, {
                id: "small-cordy-royal-jelly",
                name: "Small Cordy Royal Jelly",
                keywords: /small cordy royal jelly|small cordyceps|small royal jelly|small cordy|small jelly/i,
                image: "Cordy Royal Jelly.png",
                description: "Comprehensive health benefits, combining Cordyceps and Royal Jelly in a smaller pack.",
                price: "₦14,200",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/WNGLZNUXKXXIF1",
                blogLink: "https://example.com/blog/small-cordy-royal-jelly",
                qna: []
            }, {
                id: "cordy-royal-jelly",
                name: "Cordy Royal Jelly",
                keywords: /cordy royal jelly|cordyceps|royal jelly/i,
                image: "Cordy Royal Jelly.png",
                description: "Comprehensive health benefits, combining Cordyceps and Royal Jelly.",
                price: "₦36,000",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/WNGLZNUXKXXIF1",
                blogLink: "https://example.com/blog/cordy-royal-jelly",
                qna: []
            }, {
                id: "small-golden-hypha",
                name: "Small Golden Hypha",
                keywords: /small golden hypha|golden hypha small/i,
                image: "Golden-Hypha.png",
                description: "Powerful immune system booster and anti-cancer properties in a smaller size.",
                price: "₦17,000",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/WNGLZNUXKXXIF1",
                blogLink: "https://example.com/blog/small-golden-hypha",
                qna: []
            }, {
                id: "golden-hypha",
                name: "Golden Hypha",
                keywords: /golden hypha|immune booster|anti-cancer|anti-tumor/i,
                image: "Golden-Hypha.png",
                description: "Powerful immune system booster and anti-cancer properties.",
                price: "₦50,000",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/WNGLZNUXKXXIF1",
                blogLink: "https://example.com/blog/golden-hypha",
                qna: []
            }, {
                id: "reishi-blood-tonic",
                name: "Reishi (Blood Tonic)",
                keywords: /reishi blood tonic|blood health|anemia|iron deficiency/i,
                image: "Reishi.png",
                description: "Supports blood health, liver function, and overall well-being.",
                price: "₦28,000",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/WNGLZNUXKXXIF1",
                blogLink: "https://example.com/blog/reishi-blood-tonic",
                qna: []
            }, {
                id: "hydrogen-cup",
                name: "Hydrogen Cup",
                keywords: /hydrogen cup|alkaline water|antioxidant water|hydrogen rich water/i,
                image: "Hydrogen cup (1).jpg",
                description: "Generates hydrogen-rich alkaline water for enhanced hydration and antioxidant benefits.",
                price: "₦75,000",
                type: "Devices",
                buyNowLink: "https://wa.me/message/WNGLZNUXKXXIF1",
                blogLink: "https://example.com/blog/hydrogen-cup",
                qna: [{
                    question: "What are the benefits of hydrogen water?",
                    answer: "Hydrogen water is believed to have antioxidant properties, reduce inflammation, and improve cellular health."
                }, {
                    question: "How often should I use the Hydrogen Cup?",
                    answer: "You can use the Hydrogen Cup daily to make hydrogen-rich water for regular consumption."
                }]
            }, {
                id: "sulphur-anti-acne-soap",
                name: "Sulphur Anti-Acne Soap",
                keywords: /sulphur anti-acne soap|acne soap|pimple soap|pimples|blackheads|Readness|Body odour|skin care|sulphur soap/i,
                image: "sulphur anti-acne soap.jpeg",
                description: "A specialized soap formulated with sulfur to help treat acne, control oil, and cleanse pores.",
                price: "₦5,500",
                type: "Soaps",
                buyNowLink: "https://wa.me/message/WNGLZNUXKXXIF1",
                blogLink: "https://example.com/blog/sulphur-anti-acne-soap",
                qna: [{
                    question: "How does Sulphur Anti-Acne Soap work?",
                    answer: "Sulfur helps to dry out the skin, remove dead skin cells, and has antibacterial properties that can reduce acne breakouts."
                }, {
                    question: "Can I use this soap daily?",
                    answer: "It's generally recommended to start with once a day and increase to twice daily if tolerated, as sulfur can be drying. Consult a dermatologist if you have sensitive skin."
                }, {
                    question: "Can I use this soap with other acne treatments?",
                    answer: "It's best to consult with a dermatologist before combining treatments to avoid irritation."
                }, {
                    question: "Can I use it for pimples?",
                    answer: "Yes, this soap is designed to help treat acne and pimples. However, it's important to use it as directed and consult a dermatologist if you have any concerns."
                }]
            }, {
                id: "pearl-whitening-soap",
                name: "Pearl Whitening Soap",
                keywords: /pearl whitening soap|whitening soap|brighten skin|lighten skin|pigmentation/i,
                image: "beaty soap.jpeg",
                description: "Reveals radiance, lightens dark spots, reduces pigmentation, and promotes healthy, brighter skin.",
                price: "₦5,500",
                type: "Soaps",
                buyNowLink: "https://wa.me/message/WNGLZNUXKXXIF1",
                blogLink: "https://example.com/blog/pearl-whitening-soap",
                qna: [{
                    question: "How long does it take to see visible results?",
                    answer: "Visible improvement in skin tone and texture can typically be seen after a month of consistent use, depending on individual skin type and condition. Long-term use yields better and more sustainable results."
                }, {
                    question: "Can Pearl Whitening Soap help with acne?",
                    answer: "It has little effect on acne as the papaya extract helps to exfoliate dead skin cells and clear pores, however, for acne skin, we recommend you to use our Sulfur Anti-acne Soap for better result."
                }, {
                    question: "Will Pearl Whitening Soap lighten my skin unnaturally or bleach it?",
                    answer: "Pearl Whitening Soap does not bleach. It promotes a natural glow and even skin tone by reducing dark spots, pigmentation, and dullness. It does not strip the skin but enhances your natural complexion through consistent use."
                }]
            }, {
                id: "nano-silver-antibacterial-soap",
                name: "Nano Silver Antibacterial Soap",
                keywords: /nano-silver antibacterial soap|antibacterial soap|germ shield|deep cleansing|skin hygiene/i,
                image: "beaty soap.jpeg",
                description: "Formulated with Nano Silver to eliminate harmful bacteria for clean & healthy skin, provides deep cleansing, and maintains skin barrier.",
                price: "₦5,500",
                type: "Soaps",
                buyNowLink: "https://wa.me/message/WNGLZNUXKXXIF1",
                blogLink: "https://example.com/blog/nano-silver-antibacterial-soap",
                qna: [{
                    question: "How does Nano-Silver Antibacterial Soap work?",
                    answer: "Nano-silver particles can deeply penetrate skin, eliminating harmful bacteria, fungi, and other microbes that cause infections, body odor, and irritation. It also promotes the repair and regeneration of damaged cells."
                }, {
                    question: "Is Nano-Silver Antibacterial Soap gentle on sensitive skin?",
                    answer: "Yes, it is gentle on overall skin protection, leaving skin refreshed, soft, and protected after each use. Many users report no irritation even with daily use."
                }]
            }, {
                id: "diawell",
                name: "Diawell",
                keywords: /diawell|diabetes|blood sugar/i,
                image: "DIAWELL.png",
                description: "Helps manage blood sugar levels and supports pancreatic health.",
                price: "₦33,600",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/WNGLZNUXKXXIF1",
                blogLink: "https://example.com/blog/diawell",
                qna: [{
                    question: "Can Diawell replace my diabetes medication?",
                    answer: "No, Diawell is a supplement and should not replace prescribed diabetes medication. Always consult your doctor before making any changes to your medication."
                }]
            }, {
                id: "golden-six",
                name: "Golden Six",
                keywords: /golden six|hormonal balance|kidney liver/i,
                image: "Golden six.png",
                description: "Supports hormonal balance, strengthens the kidney and liver, anti-aging.",
                price: "₦15,500",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/WNGLZNUXKXXIF1",
                blogLink: "https://example.com/blog/golden-six",
                qna: []
            }, {
                id: "cello-q10",
                name: "Cello Q10",
                keywords: /cello q10|cardiovascular|heart health/i,
                image: "CELLO Q10.jpg",
                description: "Supports cardiovascular health and energy production at cellular level.",
                price: "₦45,000",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/WNGLZNUXKXXIF1",
                blogLink: "https://example.com/blog/cello-q10",
                qna: []
            }, {
                id: "lycovite",
                name: "Lycovite",
                keywords: /lycovite|prostate health|antioxidant/i,
                image: "lycovite.jpg",
                description: "Beneficial for prostate health and antioxidant support.",
                price: "₦38,500",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/WNGLZNUXKXXIF1",
                blogLink: "https://example.com/blog/lycovite",
                qna: []
            }, {
                id: "magilim",
                name: "Magilim",
                keywords: /magilim|weight management|fat burning/i,
                image: "Magilim.png",
                description: "Aids in weight management by promoting satiety and fat burning.",
                price: "₦30,000",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/WNGLZNUXKXXIF1",
                blogLink: "https://example.com/blog/magilim",
                qna: []
            }, {
                id: "gum-care-toothpaste",
                name: "Gum Care Toothpaste",
                keywords: /gum care toothpaste|oral hygiene|toothache|dental pain/i,
                image: "tooth-paste.jpg",
                description: "Promotes oral hygiene, strengthens gums, and freshens breath.",
                price: "₦6,999",
                type: "Oral Care",
                buyNowLink: "https://wa.me/message/WNGLZNUXKXXIF1",
                blogLink: "https://example.com/blog/gum-care-toothpaste",
                qna: []
            }, {
                id: "jointeez",
                name: "Jointeez",
                keywords: /jointeez|joint pain|arthritis|rheumatic/i,
                image: "Jointeez.jpg",
                description: "Relieves muscular, joint, and waist pain; supports bone health.",
                price: "₦18,000",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/WNGLZNUXKXXIF1",
                blogLink: "https://example.com/blog/jointeez",
                qna: []
            }, {
                id: "refresh-tea",
                name: "Refresh Tea",
                keywords: /refresh tea|detox|vision|throat/i,
                image: "refresh-tea.png",
                description: "Clears the throat, improves vision, and detoxifies.",
                price: "₦20,000",
                type: "Teas",
                buyNowLink: "https://wa.me/message/WNGLZNUXKXXIF1",
                blogLink: "https://example.com/blog/refresh-tea",
                qna: []
            }, {
                id: "memory-24-7-capsule",
                name: "Memory 24/7 Capsule",
                keywords: /memory 24\/7|brain functionality|memory|concentration/i,
                image: "MEMORY-247.png",
                description: "Enhances brain functionality, memory, and concentration.",
                price: "₦36,000",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/WNGLZNUXKXXIF1",
                blogLink: "https://example.com/blog/memory-24-7-capsule",
                qna: []
            }, {
                id: "eye-beta-capsule",
                name: "Eye Beta Capsule",
                keywords: /eye beta|vision|eye fatigue/i,
                image: "Eye Beta.png",
                description: "Promotes healthy vision and relieves eye fatigue.",
                price: "₦30,000",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/WNGLZNUXKXXIF1",
                blogLink: "https://example.com/blog/eye-beta-capsule",
                qna: []
            }, {
                id: "gastrifort-capsule",
                name: "Gastrifort Capsule",
                keywords: /gastrifort|stomach health|digestion|ulcers/i,
                image: "Gastrifort.png",
                description: "Premium tonic for stomach health, digestion, and ulcers.",
                price: "₦35,000",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/WNGLZNUXKXXIF1",
                blogLink: "https://example.com/blog/gastrifort-capsule",
                qna: []
            }, {
                id: "constilease",
                name: "Constilease",
                keywords: /constilease|constipation|digestive regularity/i,
                image: "Constilease.png",
                description: "Herbal solution for chronic constipation and digestive regularity.",
                price: "₦25,000",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/WNGLZNUXKXXIF1",
                blogLink: "https://example.com/blog/constilease",
                qna: []
            }, {
                id: "vigor-essential",
                name: "Vigor Essential",
                keywords: /vigor essential|energy|stamina|male vitality/i,
                image: "Vigor essential (1).jpg",
                description: "Herbal supplement for energy, stamina, and male vitality.",
                price: "₦24,000",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/WNGLZNUXKXXIF1",
                blogLink: "https://example.com/blog/vigor-essential",
                qna: []
            }, {
                id: "gynapharm-capsule",
                name: "Gynapharm Capsule",
                keywords: /gynapharm|female reproductive health|hormonal balance|pid|ovarian cysts/i,
                image: "GYNAPHARM.png",
                description: "Supports female reproductive health and hormonal balance.",
                price: "₦28,000",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/WNGLZNUXKXXIF1",
                blogLink: "https://example.com/blog/gynapharm-capsule",
                qna: []
            }, {
                id: "qinghao",
                name: "Qinghao",
                keywords: /qinghao|artemisia|malaria support/i,
                image: "Qinghao.jpg",
                description: "A traditional herbal supplement often associated with supporting the body's response to fever and general well-being. *Note: Not a cure for malaria; always consult a doctor.*",
                price: "₦22,000",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/WNGLZNUXKXXIF1",
                blogLink: "https://example.com/blog/qinghao",
                qna: []
            }, {
                id: "colon-cleanse",
                name: "Colon Cleanse",
                keywords: /colon cleanse|detox|digestive health|constipation relief/i,
                image: "colon-tea-cleanser.png",
                description: "Supports digestive health, promotes regularity, and aids in detoxification.",
                price: "₦28,000",
                type: "Capsules",
                buyNowLink: "https://wa.me/message/WNGLZNUXKXXIF1",
                blogLink: "https://example.com/blog/colon-cleanse",
                qna: []
            }, {
                id: "kedi-coffee",
                name: "Kedi Coffee",
                keywords: /kedi coffee|healthy coffee|energy drink|ginseng coffee/i,
                image: "COFFEE.png",
                description: "A unique blend of coffee with herbal extracts for energy and overall well-being.",
                price: "₦12,000",
                type: "Beverages",
                buyNowLink: "https://wa.me/message/WNGLZNUXKXXIF1",
                blogLink: "https://example.com/blog/kedi-coffee",
                qna: []
            }, {
                id: "blood-circulatory-massager",
                name: "Blood Circulatory Massager",
                keywords: /blood circulatory massager|bcm|circulation machine|massager|blood flow/i,
                image: "Blood-circulatory-machine.png",
                description: "Enhances blood circulation, relieves muscle tension, and promotes overall well-being through vibration and massage.",
                price: "₦120,000",
                type: "Devices",
                buyNowLink: "https://wa.me/message/WNGLZNUXKXXIF1",
                blogLink: "https://example.com/blog/blood-circulatory-massager",
                qna: [{
                    question: "How does the Blood Circulatory Massager work?",
                    answer: "The BCM uses high-frequency vibrations to stimulate blood flow, relax muscles, and improve circulation throughout the body."
                }, {
                    question: "What are the benefits of using the BCM?",
                    answer: "Benefits include improved blood circulation, pain relief, reduced fatigue, enhanced metabolism, and relaxation."
                }, {
                    question: "How often should I use the Blood Circulatory Massager?",
                    answer: "It is generally recommended to use it for 15-30 minutes once or twice daily, but always refer to the product manual for precise instructions."
                }]
            }];

            


            // Health Conditions Data
            const healthConditions = [{
                name: "Hypertension",
                keywords: /hypertension|high blood pressure|headache|dizziness|shortness of breath/i,
                images: [ // Changed to images array
                    "https://placehold.co/150x150/FF0000/FFFFFF?text=High+BP+1",
                    "https://placehold.co/150x150/CC0000/FFFFFF?text=High+BP+2",
                    "https://placehold.co/150x150/990000/FFFFFF?text=High+BP+3"
                ],
                definition: "Hypertension is a condition in which the force of the blood against the artery walls is too high, often leading to serious health issues.",
                symptoms: "Often asymptomatic; may cause headaches, dizziness, shortness of breath, nosebleeds.",
                dosage: [
                    "Requires antihypertensive medications as prescribed by a doctor.",
                    "Regular monitoring of blood pressure.",
                    "Lifestyle changes such as reducing salt intake and regular exercise."
                ],
                recommendedProducts: ["Cello Q10", "Blood Circulatory Massager"],
                qna: [{
                    question: "What causes Hypertension?",
                    answer: "Causes include genetics, poor diet, lack of physical activity, and stress."
                }, {
                    question: "How can I lower my blood pressure naturally?",
                    answer: "Lifestyle changes like diet modification, regular exercise, and stress management can help lower blood pressure."
                }]
            }, {
                name: "Arthritis",
                keywords: /arthritis|joint pain|inflammation|stiffness/i,
                images: [
                    "https://placehold.co/150x150/008080/FFFFFF?text=Arthritis+Joint",
                    "https://placehold.co/150x150/005050/FFFFFF?text=Inflamed+Joint",
                    "https://placehold.co/150x150/003030/FFFFFF?text=Hand+Pain"
                ],
                definition: "Arthritis is an inflammation of one or more joints, causing pain and stiffness that can worsen with age.",
                symptoms: "Joint pain, stiffness, swelling, redness, and decreased range of motion.",
                dosage: [
                    "Medical consultation for diagnosis and treatment plan.",
                    "Pain management, physical therapy, and anti-inflammatory medications.",
                    "Lifestyle adjustments, including exercise and diet."
                ],
                recommendedProducts: ["Jointeez"],
                qna: [{
                    question: "What are common types of arthritis?",
                    answer: "Common types include osteoarthritis, rheumatoid arthritis, and gout."
                }, {
                    question: "Can diet affect arthritis?",
                    answer: "Some diets, like the Mediterranean diet, may help reduce inflammation associated with certain types of arthritis."
                }]
            }, {
                name: "Anemia",
                keywords: /anemia|low iron|fatigue|weakness|pale skin/i,
                images: [
                    "https://placehold.co/150x150/800000/FFFFFF?text=Anemia+Blood",
                    "https://placehold.co/150x150/500000/FFFFFF?text=Fatigue+Sign",
                    "https://placehold.co/150x150/300000/FFFFFF?text=Pale+Skin"
                ],
                definition: "Anemia is a condition in which you lack enough healthy red blood cells to carry adequate oxygen to your body's tissues.",
                symptoms: "Fatigue, weakness, pale skin, shortness of breath, dizziness, cold hands and feet.",
                dosage: [
                    "Diagnosis and treatment by a healthcare professional.",
                    "Iron supplements (if iron deficiency anemia), dietary changes to include iron-rich foods.",
                    "Addressing underlying causes."
                ],
                recommendedProducts: ["Reishi (Blood Tonic)"],
                qna: [{
                    question: "What causes anemia?",
                    answer: "Causes include iron deficiency, vitamin deficiencies, chronic diseases, and genetic conditions."
                }, {
                    question: "How can I increase my iron intake naturally?",
                    answer: "Eat iron-rich foods like red meat, beans, spinach, and fortified cereals. Vitamin C helps with iron absorption."
                }]
            }];

            // FAQs
            const faqs = [{
                q: /how can i order|where to buy|buy products/i,
                a: "You can place an order directly on our website, or through our mobile app. You can also click the 'Buy Now' links provided for each product."
            }, {
                q: /bonus coupon|sponsor code/i,
                a: "🎉 Your Kedi Bonus Coupon is 1234567. use this as sponsorship coder."
            }, {
                q: /Find Healthcare Centres 🌍|/i,
                a: "Visit/Click the Health Center at the top page."    
           }, {
                q: /return policy|refunds/i,
                a: "We have a 30-day return policy for unopened products. Please see our website for more details or contact our support team."
            }, {
                q: /return policy|refunds/i,
                a: "We have a 30-day return policy for unopened products. Please see our website for more details or contact our support team."
            }, {
                q: /contact support|customer service|helpline/i,
                a: "You can contact our support team via email at support@kedihealthcare.com or call us at +234 800 123 4567. You can also reach us via WhatsApp using the link: <a href='https://wa.me/message/WNGLZNUXKXXIF1' target='_blank' class='text-green-600 underline'>Chat on WhatsApp</a>."
            }, {
                q: /what is kedi healthcare|about kedi healthcare/i,
                a: "Kedi Healthcare is a leading traditional Chinese medicine (TCM) company in Nigeria, dedicated to providing high-quality herbal and nutritional supplements for various health needs. We focus on natural solutions for overall well-being."
            }, {
                q: /kedi healthcare products|what products do you offer/i,
                a: "Kedi Healthcare offers a wide range of natural health products, including supplements for immune support (Reishi), male sexual health (Re-Vive), kidney health (Golden Six), digestive health (Colon Cleanse), energy (Vigor Essential), respiratory health (Cordy Active), weight management (Magilim), and cardiovascular health (Blood Fat Reducing)."
            }, {
                q: /kedi healthcare products list|list all products/i,
                a: "Certainly! Here is a list of Kedi Healthcare products: Reishi, Re-Vive, Golden Six, Colon Cleanse, Vigor Essential, Cordy Active, Magilim, and Blood Fat Reducing. You can ask for details on any of these."
            }, {
                q: /kedi healthcare products details|tell me about your products/i,
                a: "To get details about a specific product, please ask me about it by name, e.g., 'Tell me about Reishi' or 'What is Re-Vive?'"
            }, {
                q: /kedi healthcare product prices|how much are your products/i,
                a: "Product prices vary. For example, Reishi is ₦35,000, and Re-Vive is ₦39,000. You can ask me about the price of a specific product."
            }, {
                q: /how to make money with kedi|kedi business model|become a kedi distributor|kedi income|kedi earnings|kedi opportunity/i,
                a: `
                    <p class="mb-2">Kedi Healthcare offers a unique opportunity to improve your health and wealth through its direct selling and multi-level marketing (MLM) business model. Here's how you can make money with Kedi:</p>
                    <ul class="list-disc list-inside mb-4 text-gray-700">
                        <li><strong>Become a Registered Distributor:</strong> The first step is to register as an independent Kedi distributor. This usually involves a small registration fee and purchasing a starter kit.</li>
                        <li><strong>Retail Profit:</strong> You buy Kedi products at a wholesale price and sell them to customers at the retail price. The difference is your immediate profit.</li>
                        <li><strong>Performance Bonuses:</b> As you sell more products and build a team, you earn performance bonuses based on your personal sales volume and the sales volume of your team (downline). Kedi has a structured compensation plan that rewards higher sales and team growth.</li>
                        <li><strong>Leadership Bonuses:</b> For those who build and mentor successful teams, Kedi offers leadership bonuses and incentives, which can include car awards, house funds, and international trips.</li>
                        <li><strong>Recruitment and Team Building:</strong> A significant part of the MLM model is recruiting new distributors into your team. You earn commissions and bonuses not just from your sales, but also from the sales generated by the people you recruit and their recruits.</li>
                    </ul>
                    <p class="mb-2"><strong>Benefits of the Kedi Business:</strong></p>
                    <ul class="list-disc list-inside mb-4 text-gray-700">
                        <li><strong>Flexibility:</strong> Work at your own pace and set your own hours.</li>
                        <li><strong>High-Quality Products:</strong> Promote natural health products that genuinely benefit people.</li>
                        <li><strong>Training and Support:</b> Kedi often provides training, seminars, and support materials to help distributors succeed.</li>
                        <li><strong>Community:</strong> Become part of a network of like-minded individuals.</li>
                    </ul>
                    <p class="font-semibold text-green-700">To get detailed information on the compensation plan, registration process, and to start your Kedi business, we recommend visiting the official Kedi Healthcare website or contacting their nearest office/distributor directly. You can also reach out to our customer service for general inquiries.</p>
                `
            }];


            // Chatbot Responses for general queries
            const chatbotResponses = [{
                keywords: /general health tips|health advice/i,
                answer: "Maintaining good health involves several key practices. Here are some general health tips:"
            }, ];

            // Health Tips
            const generalHealthTips = [
                "Using groundnut oil for frying more than 2 times a day can raise cholesterol levels? 🥜 It contains high levels of saturated fats that can be harmful to your heart!.",
                "Using groundnut oil for cooking can help lower cholesterol levels? 🥜 It contains healthy fats that are good for your heart!.",
                "Don't use groundnut oil for frying? 🥜 It has a low smoke point and can produce harmful compounds when overheated!.",
                "Using sunflower oil for cooking can help lower cholesterol levels? 🌻 It contains healthy fats that are good for your heart!.",
                "Better still, use olive oil for cooking? 🫒 It has a high smoke point and is rich in healthy monounsaturated fats!.",
                "Don't use too much of coconut oil for cooking? 🥥 It contains high levels of saturated fats that can raise cholesterol levels!.",
                "Don't use too much of palm oil for tropical cooking? 🌴 It contains high levels of saturated fats that can raise cholesterol levels!.",
                "🌿 Some herbs like Reishi, Moringa, and Ginseng support immunity and reduce fatigue? 🌱🛡️",
                "🍠 Sweet potatoes are rich in beta-carotene, which helps improve eye health and immunity? 👁️🍠",
                "🧠 Your brain is sometimes more active at night than during the day! 💤 It processes emotions and memories while you sleep.",
                "💧 Drinking water boosts your energy, mood, and focus? 🚰 Even mild dehydration can make you feel tired and foggy!.",
                "🏃‍♂️ Just 30 minutes of walking a day can reduce your risk of heart disease by up to 40%? ❤️.",
                "🍎 Eating an apple a day really can help keep the doctor away? 🍏 Apples are rich in fiber and antioxidants that support gut and heart health!.",
                "😄 Smiling can improve your immune system and lower stress? 😊 It releases endorphins, your body's natural feel-good chemicals..",
                "🌞 10-15 minutes of sunlight a day helps your body make Vitamin D for stronger bones and better mood? ☀️.",
                "🧘‍♀️ Practicing mindfulness and meditation can reduce anxiety and improve your overall well-being? 🧘‍♂️.",
                "🧠 Your brain is sometimes more active at night than during the day! 💤 It processes emotions and memories while you sleep.",
                "💤 Lack of sleep can make you gain weight? 😴 Sleep controls hunger hormones like ghrelin and leptin..",
                "Spend time outdoors for fresh air and sunlight (with sun protection).",
                "🧘‍♂️ Regular physical activity can improve your mood and reduce anxiety? 🏋️‍♀️ Aim for at least 150 minutes of moderate exercise each week.",
                "🧘‍♀️ Practicing yoga can improve flexibility and reduce stress? 🧘‍♂️ Even a few minutes a day can make a difference.",
                "🧄 Garlic is a natural antibiotic? 🧄 It boosts your immune system and fights bacteria and viruses!.",
                "🧘‍♀️ Regular meditation can reduce blood pressure and anxiety? 🧘‍♂️ Just 10 minutes a day can make a big difference.",
                "🧘‍♂️ Deep breathing exercises can help reduce stress and improve focus? 🧘‍♀️ Try taking a few deep breaths right now!",
                "🧘‍♀️ Practicing gratitude can improve your mental health and overall well-being? 🙏 Consider keeping a gratitude journal!",
                "🧘‍♂️ Engaging in creative activities can boost your mood and reduce stress? 🎨 Try drawing, painting, or crafting!",

            ];

            // === UI Element References (initialized on DOMContentLoaded) ===
            let openBtn, closeBtn, chatbotWindow, chatbotInput, chatbotMessages, sendBtn, scrollIndicator;

            // === State Variables ===
            let currentSuggestions = [];
            let waitingForSymptoms = false; // Flag to manage symptom checker state
            let waitingForHealthGoal = false; // Flag for personalized recommendations
            let currentHealthTipIndex = 0; // Index for "Did you know" health tips
            let hasGreeted = false; // New flag to ensure greeting only happens once

            // Variables for scroll indicator dragging
            let isDraggingIndicator = false;
            let startY = 0;
            let startScrollTop = 0;

            // --- DOM Content Loaded Event Listener ---
            document.addEventListener('DOMContentLoaded', async () => {
                // Get references to UI elements
                openBtn = document.getElementById('open-chatbot-btn');
                closeBtn = document.getElementById('close-chatbot-btn');
                chatbotWindow = document.getElementById('chatbot-window');
                chatbotInput = document.getElementById('chatbot-input');
                chatbotMessages = document.getElementById('chatbot-messages');
                sendBtn = document.getElementById('send-btn');
                scrollIndicator = document.getElementById('scroll-indicator');

                // Set the chat icon image source
                // First, remove any existing Font Awesome icon if present
                if (openBtn.querySelector('.fas')) {
                    openBtn.querySelector('.fas').remove();
                }
                // Then, add or update the image element
                let chatIconImg = openBtn.querySelector('img');
                if (!chatIconImg) {
                    chatIconImg = document.createElement('img');
                    openBtn.appendChild(chatIconImg);
                }
                chatIconImg.src = CHAT_ICON_IMAGE_URL;
                chatIconImg.alt = "Chatbot Icon - Replace This Image";


                // === Event Listeners ===
                openBtn.addEventListener('click', handleOpenChatbot);
                closeBtn.addEventListener('click', handleCloseChatbot);
                sendBtn.addEventListener('click', handleSendMessage);
                chatbotInput.addEventListener('keypress', handleInputKeyPress);

                // Event listener for dynamically added Q&A buttons inside product/condition cards
                chatbotMessages.addEventListener('click', (event) => {
                    if (event.target.classList.contains('qna-btn')) {
                        const type = event.target.dataset.type;
                        const name = event.target.dataset.name;
                        displayDetailedInfo(type, name);
                    }
                });

                // Scroll indicator logic
                let hideIndicatorTimeout;

                /**
                 * Updates the position and visibility of the custom scroll indicator.
                 */
                function updateScrollIndicator() {
                    const visibleHeight = chatbotMessages.clientHeight;
                    const scrollHeight = chatbotMessages.scrollHeight;
                    const scrollTop = chatbotMessages.scrollTop;

                    if (scrollHeight <= visibleHeight) {
                        // No scrollbar needed, hide indicator
                        scrollIndicator.style.opacity = '0';
                        return;
                    }

                    // Calculate indicator height proportional to visible content
                    let indicatorHeight = (visibleHeight / scrollHeight) * visibleHeight;
                    // Ensure a minimum height for usability, e.g., 20px
                    indicatorHeight = Math.max(indicatorHeight, 20);

                    // Calculate the maximum scrollable track height for the indicator
                    const maxIndicatorTop = visibleHeight - indicatorHeight;

                    // Calculate indicator top position
                    const scrollRatio = scrollTop / (scrollHeight - visibleHeight);
                    const indicatorTop = scrollRatio * maxIndicatorTop;

                    scrollIndicator.style.height = `${indicatorHeight}px`;
                    scrollIndicator.style.top = `${indicatorTop}px`;
                    scrollIndicator.style.opacity = '1'; // Make it visible

                    // Set a timeout to hide the indicator after a short delay if no further scrolling
                    clearTimeout(hideIndicatorTimeout);
                    hideIndicatorTimeout = setTimeout(() => {
                        if (!isDraggingIndicator) { // Only hide if not dragging
                            scrollIndicator.style.opacity = '0';
                        }
                    }, 1500); // Hide after 1.5 seconds of inactivity
                }

                chatbotMessages.addEventListener('scroll', updateScrollIndicator);
                chatbotMessages.addEventListener('mouseenter', () => {
                    if (chatbotMessages.scrollHeight > chatbotMessages.clientHeight) {
                        scrollIndicator.style.opacity = '1';
                        clearTimeout(hideIndicatorTimeout);
                    }
                });
                chatbotMessages.addEventListener('mouseleave', () => {
                    if (chatbotMessages.scrollHeight > chatbotMessages.clientHeight && !isDraggingIndicator) {
                        hideIndicatorTimeout = setTimeout(() => {
                            scrollIndicator.style.opacity = '0';
                        }, 500); // Fade out faster on mouse leave
                    }
                });

                // Initial update of the scroll indicator when the chatbot opens
                // This will be called when the chatbot is made visible.
                const observer = new MutationObserver((mutationsList) => {
                    for (const mutation of mutationsList) {
                        if (mutation.attributeName === 'class' && chatbotWindow.classList.contains('open')) {
                            updateScrollIndicator();
                            observer.disconnect(); // Disconnect once opened for the first time
                            break;
                        }
                    }
                });
                observer.observe(chatbotWindow, {
                    attributes: true
                });

                // --- Scroll Indicator Draggability ---
                scrollIndicator.addEventListener('mousedown', handleIndicatorMouseDown);
                scrollIndicator.addEventListener('touchstart', handleIndicatorTouchStart, {
                    passive: false
                }); // Use passive: false to allow preventDefault

                document.addEventListener('mousemove', handleIndicatorMouseMove);
                document.addEventListener('touchmove', handleIndicatorTouchMove, {
                    passive: false
                });

                document.addEventListener('mouseup', handleIndicatorMouseUp);
                document.addEventListener('touchend', handleIndicatorTouchEnd);

                // === Event Handlers ===

                /** Handles opening the chatbot window. */
                async function handleOpenChatbot() {
                    chatbotWindow.classList.remove('hidden');
                    chatbotWindow.classList.add('open');
                    openBtn.classList.add('hidden'); // Hide open button when chatbot is open
                    console.log('Chatbot opened. hasGreeted:', hasGreeted); // Debug log

                    if (!hasGreeted) { // Use the new flag
                        console.log('Sending initial greeting...'); // Debug log
                        const options = {
                            hour: 'numeric',
                            hourCycle: 'h23',
                            timeZone: 'Africa/Lagos'
                        };
                        const dateInLagos = new Intl.DateTimeFormat('en-US', options).format(new Date());
                        const hour = parseInt(dateInLagos);

                        let greeting;
                        let emoji;
                        if (hour >= 5 && hour < 12) {
                            greeting = "Good morning";
                            emoji = "☀️";
                        } else if (hour >= 12 && hour < 18) {
                            greeting = "Good afternoon";
                            emoji = "👋";
                        } else {
                            greeting = "Good evening";
                            emoji = "🌙";
                        }

                        // Send the greeting message first and await its completion
                        await sendBotMessageWithTyping(`${greeting} ${emoji}! I'm your Kedi Healthcare Assistant. I'm here to help you with:
                            <ul>
                                <li>Product information and benefits 💊</li>
                                <li>Insights into various health conditions 🩺</li>
                                <li>How to start your own Kedi business 💰</li>
                                <li>General health tips and FAQs ❓</li>
                            </ul>
                            How can I help you today?`);

                        // Then display the suggestions
                        displaySuggestions([{
                            text: "List all products",
                            type: "text"
                        }, {
                            text: "How to make money with Kedi? 💰",
                            type: "text"
                        }, {
                            text: "Find Healthcare Centres 🌍",
                            type: "text"  
                        }, {
                            text: "Tell me about Hydrogen Cup",
                            type: "text"
                        }, {
                            text: "Tell me about Refresh Tea",
                            type: "text"
                        }, {
                            text: "Tell me about Blood Circulatory Massager",
                            type: "text"
                        }, {
                            text: "Tell me about Colon Cleanse",
                            type: "text"
                        }, {
                            text: "General health tips 💡",
                            type: "text"
                        }, {
                            text: "Symptom Checker ✨",
                            type: "text"
                        }, {
                            text: "Personalized Product Recommendation ✨",
                            type: "text"
                        }, {
                            text: "Contact support 📞",
                            type: "text"
                        }, {
                             text: "Bonus Coupon 🎁",
                              type: "text"

                        }]);
                        hasGreeted = true; // Set flag after greeting and initial suggestions
                    }
                }

                /** Handles closing the chatbot window. */
                function handleCloseChatbot() {
                    chatbotWindow.classList.remove('open');
                    chatbotWindow.classList.add('hidden');
                    openBtn.classList.remove('hidden'); // Show open button when chatbot is closed
                }

                /** Handles sending a message when the send button is clicked. */
                function handleSendMessage(e) {
                    e.preventDefault();
                    sendMessage();
                }

                /** Handles sending a message when Enter key is pressed in the input. */
                function handleInputKeyPress(e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        sendMessage();
                    }
                }

                /** Handles mousedown event on the scroll indicator. */
                function handleIndicatorMouseDown(e) {
                    isDraggingIndicator = true;
                    startY = e.clientY;
                    startScrollTop = chatbotMessages.scrollTop;
                    scrollIndicator.classList.add('dragging');
                    e.preventDefault(); // Prevent text selection during drag
                }

                /** Handles touchstart event on the scroll indicator. */
                function handleIndicatorTouchStart(e) {
                    isDraggingIndicator = true;
                    startY = e.touches[0].clientY;
                    startScrollTop = chatbotMessages.scrollTop;
                    scrollIndicator.classList.add('dragging');
                    e.preventDefault(); // Prevent default scrolling
                }

                /** Handles mousemove event for scroll indicator dragging. */
                function handleIndicatorMouseMove(e) {
                    if (!isDraggingIndicator) return;

                    const deltaY = e.clientY - startY;
                    const scrollTrackHeight = chatbotMessages.clientHeight - scrollIndicator.offsetHeight;
                    const scrollContentHeight = chatbotMessages.scrollHeight - chatbotMessages.clientHeight;

                    if (scrollTrackHeight <= 0 || scrollContentHeight <= 0) return;

                    const scrollRatio = deltaY / scrollTrackHeight;
                    let newScrollTop = startScrollTop + scrollRatio * scrollContentHeight;

                    newScrollTop = Math.max(0, Math.min(newScrollTop, scrollContentHeight));

                    chatbotMessages.scrollTop = newScrollTop;
                    updateScrollIndicator(); // Update indicator position immediately
                }

                /** Handles touchmove event for scroll indicator dragging. */
                function handleIndicatorTouchMove(e) {
                    if (!isDraggingIndicator) return;

                    const deltaY = e.touches[0].clientY - startY;
                    const scrollTrackHeight = chatbotMessages.clientHeight - scrollIndicator.offsetHeight;
                    const scrollContentHeight = chatbotMessages.scrollHeight - chatbotMessages.clientHeight;

                    if (scrollTrackHeight <= 0 || scrollContentHeight <= 0) return;

                    const scrollRatio = deltaY / scrollTrackHeight;
                    let newScrollTop = startScrollTop + scrollRatio * scrollContentHeight;

                    newScrollTop = Math.max(0, Math.min(newScrollTop, scrollContentHeight));

                    chatbotMessages.scrollTop = newScrollTop;
                    updateScrollIndicator();
                    e.preventDefault(); // Prevent default scrolling
                }

                /** Handles mouseup event to stop scroll indicator dragging. */
                function handleIndicatorMouseUp() {
                    if (isDraggingIndicator) {
                        isDraggingIndicator = false;
                        scrollIndicator.classList.remove('dragging');
                        updateScrollIndicator(); // Ensure indicator state is correct after drag ends
                    }
                }

                /** Handles touchend event to stop scroll indicator dragging. */
                function handleIndicatorTouchEnd() {
                    if (isDraggingIndicator) {
                        isDraggingIndicator = false;
                        scrollIndicator.classList.remove('dragging');
                        updateScrollIndicator(); // Ensure indicator state is correct after drag ends
                    }
                    // Add a small delay before potentially hiding the indicator after touch end
                    setTimeout(() => {
                        if (!isDraggingIndicator) {
                            scrollIndicator.style.opacity = '0';
                        }
                    }, 500);
                }

                // === Core Chatbot Functions ===

                /**
                 * Adds a message to the chatbot display.
                 * @param {string} sender - 'user' or 'bot'.
                 * @param {string} text - The message content.
                 * @param {boolean} [isTypingIndicator=false] - True if it's a typing indicator.
                 * @returns {HTMLElement} The created message element.
                 */
                function addMessage(sender, text, isTypingIndicator = false) {
                    const msg = document.createElement('div');
                    msg.classList.add('message');

                    if (sender === "user") {
                        msg.classList.add('user-message');
                        msg.textContent = text;
                    } else {
                        msg.classList.add('bot-message');
                        // Create a div for the actual message content to apply padding and background
                        const contentDiv = document.createElement('div');
                        contentDiv.classList.add('bot-message-content');

                        if (isTypingIndicator) {
                            contentDiv.classList.add('typing-indicator');
                            contentDiv.innerHTML = `<span class="dots"><span></span><span></span><span></span></span>`; // Only dots for indicator
                        } else {
                            contentDiv.innerHTML = text; // Use innerHTML for rich content (like product cards)
                        }

                        // Add bot avatar
                        const avatarImg = document.createElement('img');
                        avatarImg.src = BOT_AVATAR_URL;
                        avatarImg.alt = "Bot Avatar";
                        avatarImg.classList.add('bot-avatar');
                        msg.appendChild(avatarImg);
                        msg.appendChild(contentDiv); // Append content div to message
                    }

                    chatbotMessages.appendChild(msg);
                    // Ensure scroll to bottom after adding message
                    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
                    updateScrollIndicator(); // Update indicator after new message
                    return msg;
                }

                /**
                 * Creates the HTML string for a product card.
                 * @param {object} product - The product object.
                 * @returns {string} HTML string for the product card.
                 */
                function createProductCardHtml(product) {
                    const qnaButton = product.qna && product.qna.length > 0 ?
                        `<button class="qna-btn suggestion-button" data-type="product" data-name="${product.name}">Q&A</button>` :
                        '';

                    return `
                        <div class="product-card">
                            <div class="image-container">
                                <img src="${product.image}" alt="${product.name}" onerror="this.onerror=null;this.src='https://placehold.co/150x150/CCCCCC/333333?text=Product';" />
                            </div>
                            <h4>${product.name}</h4>
                            <p>${product.description}</p>
                            <div class="price">${product.price}</div>
                            <div class="button-group">
                                <a href="${product.buyNowLink}" target="_blank" class="buy-now-btn">Buy Now</a>
                                ${product.blogLink ? `<a href="${product.blogLink}" target="_blank" class="blog-btn">Read Blog</a>` : ''}
                                ${qnaButton}
                                <a href="${WHATSAPP_BUSINESS_LINK}" target="_blank" class="whatsapp-buy-btn">Chat to Buy 💬</a>
                            </div>
                        </div>
                    `;
                }

                /**
                 * Creates the HTML string for a health condition card.
                 * @param {object} condition - The health condition object.
                 * @returns {string} HTML string for the health condition card.
                 */
                function createHealthConditionCardHtml(condition) {
                    const qnaButton = condition.qna && condition.qna.length > 0 ?
                        `<button class="qna-btn suggestion-button" data-type="condition" data-name="${condition.name}">Q&A</button>` :
                        '';

                    let recommendedProductsHtml = '';
                    if (condition.recommendedProducts && condition.recommendedProducts.length > 0) {
                        recommendedProductsHtml += `<h4 class="mt-4 text-lg font-semibold text-gray-800">Kedi Healthcare products that may offer support:</h4>`;
                        condition.recommendedProducts.forEach(prodName => {
                            const product = products.find(p => p.name === prodName);
                            if (product) {
                                recommendedProductsHtml += createProductCardHtml(product);
                            }
                        });
                    } else {
                        recommendedProductsHtml += `<p class="mt-4 text-gray-600">While Kedi Healthcare products focus on general well-being, for ${condition.name}, it's crucial to follow medical advice. No specific Kedi product directly treats this condition, but general health support products may be beneficial.</p>`;
                    }

                    // Generate image tags for all images in the array
                    const imagesHtml = condition.images.map(imgSrc => `
                        <img src="${imgSrc}" alt="${condition.name}" onerror="this.onerror=null;this.src='https://placehold.co/150x150/CCCCCC/333333?text=Condition';" />
                    `).join('');

                    return `
                        <div class="health-condition-card">
                            <div class="image-container">
                                ${imagesHtml}
                            </div>
                            <h4>${condition.name}</h4>
                            ${condition.definition ? `<p><strong class="text-gray-700">Definition:</strong> ${condition.definition}</p>` : ''}
                            <p><strong class="text-gray-700">Symptoms:</strong> ${condition.symptoms}</p>
                            <p><strong class="text-gray-700">Recommended Approach:</strong> ${condition.dosage.join(' ')}</p>
                            ${recommendedProductsHtml}
                            <div class="button-group">
                                ${qnaButton}
                            </div>
                        </div>
                    `;
                }


                /**
                 * Creates the HTML string for a health tip card.
                 * @param {string} tipContent - The content of the health tip.
                 * @returns {string} HTML string for the health tip card.
                 */
                function createHealthTipCardHtml(tipContent) {
                    return `
                        <div class="health-tip-card">
                            <h4 class="font-bold text-lg mb-2">💡 Did you know? 💡</h4>
                            <p>${tipContent}</p>
                            <small class="text-gray-500 mt-2 block"><em>Please note: These are general health tips and not a substitute for professional medical advice. Always consult a healthcare professional for personalized guidance.</em></small>
                        </div>
                    `;
                }


                /**
                 * Displays a set of clickable suggestions to the user.
                 * @param {Array<Object>} suggestions - An array of suggestion objects { text: string, type: string, [url]: string, [name]: string }.
                 */
                function displaySuggestions(suggestions) {
                    currentSuggestions = suggestions; // Store current suggestions
                    const suggestionsContainer = document.createElement('div');
                    suggestionsContainer.className = 'suggestions-container bot-message'; // Apply bot-message styling
                    suggestionsContainer.style.background = 'transparent'; // Override background for buttons

                    suggestions.forEach(suggestion => {
                        const button = document.createElement('button');
                        button.className = 'suggestion-button';
                        button.textContent = suggestion.text;
                        button.dataset.type = suggestion.type; // e.g., 'text', 'product-qna', 'condition-qna'
                        if (suggestion.name) { // For product/condition specific Q&A
                            button.dataset.name = suggestion.name;
                        }

                        if (suggestion.type === "link" && suggestion.url) { // Handle link type suggestions
                            button.addEventListener('click', () => {
                                window.open(suggestion.url, '_blank');
                                addMessage('user', suggestion.text); // Show user's "click" as a message
                                chatbotInput.value = ''; // Clear input after suggestion click
                                suggestionsContainer.remove();
                                currentSuggestions = [];
                            });
                        } else {
                            button.addEventListener('click', () => {
                                addMessage('user', suggestion.text); // Show user's "click" as a message
                                chatbotInput.value = ''; // Clear input after suggestion click
                                respondToUser(suggestion.text);
                                // Remove suggestions after one is clicked
                                suggestionsContainer.remove();
                                currentSuggestions = [];
                            });
                        }
                        suggestionsContainer.appendChild(button);
                    });
                    chatbotMessages.appendChild(suggestionsContainer);
                    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
                    updateScrollIndicator(); // Update indicator after new suggestions
                }

                /**
                 * Simulates bot typing and then displays the full message.
                 * @param {string} messageContent - The message to display.
                 * @param {number} delayPerChar - Delay in ms per character for typing effect.
                 * @param {number} delayBetweenStages - Delay in ms before showing full message.
                 */
                async function sendBotMessageWithTyping(messageContent, delayPerChar = 20, delayBetweenStages = 300) {
                    // Create and append a temporary typing indicator message
                    const typingIndicatorMessage = addMessage("bot", "", true); // isTypingIndicator = true
                    console.log('Typing indicator added.'); // Debug log

                    // Scroll to bottom to show typing indicator
                    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

                    // Simulate typing delay
                    await new Promise(resolve => setTimeout(resolve, delayBetweenStages));
                    console.log('Typing delay finished.'); // Debug log

                    // Remove the typing indicator message
                    typingIndicatorMessage.remove();
                    console.log('Typing indicator removed.'); // Debug log

                    // Add the actual message content
                    addMessage("bot", messageContent);
                    console.log('Actual message added.'); // Debug log

                    // Ensure scroll to bottom after adding the full message
                    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
                    updateScrollIndicator(); // Update scroll indicator after final message
                }


                /**
                 * Displays detailed information about a product or health condition, including Q&A.
                 * @param {string} type - 'product' or 'condition'.
                 * @param {string} name - The name of the product or condition.
                 */
                async function displayDetailedInfo(type, name) {
                    let item;
                    let responseHtml = '';
                    let suggestions = [];

                    if (type === 'product') {
                        item = products.find(p => p.name === name);
                        if (item) {
                            responseHtml += `<h3 class="text-xl font-bold text-purple-700 mb-4">Product Details: ${item.name} 💊</h3>`; // Section heading with emoji
                            responseHtml += createProductCardHtml(item);
                            if (item.qna && item.qna.length > 0) {
                                responseHtml += `<h4 class="mt-4 text-lg font-semibold text-gray-800">Frequently Asked Questions about ${item.name}:</h4><ul>`; // Section heading
                                item.qna.forEach(qa => {
                                    responseHtml += `<li class="mb-2"><strong class="text-green-700">${qa.question}</strong><br>${qa.answer}</li>`;
                                });
                                responseHtml += `</ul>`;
                            } else {
                                responseHtml += `<p class="mt-4 text-gray-600">No specific Q&A available for ${item.name} at the moment.</p>`;
                            }

                            // If the product is a soap, suggest other soaps
                            if (item.type === 'Soaps') {
                                const otherSoaps = products.filter(p => p.type === 'Soaps' && p.id !== item.id); // Use ID for uniqueness
                                if (otherSoaps.length > 0) {
                                    responseHtml += `<h4 class="mt-4 text-lg font-semibold text-gray-800">You might also be interested in these other Kedi Healthcare soaps:🧼</h4>`; // Section heading with emoji
                                    otherSoaps.forEach(soap => {
                                        responseHtml += createProductCardHtml(soap);
                                        suggestions.push({
                                            text: `Tell me about ${soap.name}`,
                                            type: "text"
                                        });
                                    });
                                }
                            }

                            // Add specific buy suggestions after product details
                            suggestions.push({
                                text: `Buy ${item.name}`,
                                type: "link",
                                url: item.buyNowLink
                            });
                            suggestions.push({
                                text: `Chat to Buy ${item.name} 💬`,
                                type: "link",
                                url: WHATSAPP_BUSINESS_LINK
                            });
                            suggestions.push({
                                text: `More about Kedi products`,
                                type: "text"
                            });
                            suggestions.push({
                                text: `List all products`,
                                type: "text"
                            });
                            suggestions.push({
                                text: `General health tips 💡`,
                                type: "text"
                            });
                            suggestions.push({
                                text: "Symptom Checker ✨",
                                type: "text"
                            });
                            suggestions.push({
                                text: "Personalized Product Recommendation ✨",
                                type: "text"
                            });
                        }
                    } else if (type === 'condition') {
                        item = healthConditions.find(c => c.name === name);
                        if (item) {
                            responseHtml += `<h3 class="text-xl font-bold text-purple-700 mb-4">Health Challenge: ${item.name} 🩺</h3>`; // Section heading with emoji
                            responseHtml += createHealthConditionCardHtml(item); // Use the new function here

                            if (item.qna && item.qna.length > 0) {
                                responseHtml += `<h4 class="mt-4 text-lg font-semibold text-gray-800">Frequently Asked Questions:</h4><ul>`; // Section heading
                                item.qna.forEach(qa => {
                                    responseHtml += `<li class="mb-2"><strong class="text-green-700">${qa.question}</strong><br>${qa.answer}</li>`;
                                });
                                responseHtml += `</ul>`;
                            } else {
                                responseHtml += `<p class="mt-4 text-gray-600">No specific Q&A available for ${item.name} at the moment.</p>`;
                            }
                            suggestions.push({
                                text: `More health conditions`,
                                type: "text"
                            });
                            suggestions.push({
                                text: "General health tips 💡",
                                type: "text"
                            });
                            suggestions.push({
                                text: "Symptom Checker ✨",
                                type: "text"
                            });
                            suggestions.push({
                                text: "Personalized Product Recommendation ✨",
                                type: "text"
                            });
                        }
                    }

                    if (responseHtml) {
                        await sendBotMessageWithTyping(responseHtml);
                        if (suggestions.length > 0) {
                            displaySuggestions(suggestions);
                        }
                    }
                }

                /** Handles sending a message from the user. */
                async function sendMessage() {
                    const userMessage = chatbotInput.value.trim();
                    if (userMessage === '') return;

                    addMessage('user', userMessage);
                    chatbotInput.value = ''; // Clear input immediately

                    await respondToUser(userMessage);
                }

                /**
                 * Displays a single "Did you know?" health tip along with a "Next Tip" button.
                 * @param {number} index - The index of the tip to display.
                 */
                async function displayHealthTip(index) {
                    if (index >= 0 && index < generalHealthTips.length) {
                        const tip = generalHealthTips[index];
                        // Using the new createHealthTipCardHtml function
                        const styledTip = createHealthTipCardHtml(tip);
                        await sendBotMessageWithTyping(styledTip);
                        currentHealthTipIndex = index; // Update the current index

                        const suggestions = [];
                        suggestions.push({
                            text: "Next Tip",
                            type: "text",
                            action: "next-tip"
                        });
                        suggestions.push({
                            text: "See all health tips",
                            type: "text"
                        }); // Option to see all tips at once
                        suggestions.push({
                            text: "Back to main menu",
                            type: "text"
                        });
                        displaySuggestions(suggestions);
                    } else {
                        // If all tips have been shown, or index is out of bounds
                        await sendBotMessageWithTyping("That's all the tips I have for now! I hope they were helpful.");
                        currentHealthTipIndex = 0; // Reset for next time
                        displaySuggestions([{
                            text: "List all products",
                            type: "text"
                        }, {
                            text: "General health tips 💡",
                            type: "text"
                        }, // Offer to restart tips
                        {
                            text: "Symptom Checker ✨",
                            type: "text"
                        }, {
                            text: "Personalized Product Recommendation ✨",
                            type: "text"
                        }, {
                            text: "Contact support 📞",
                            type: "text"
                        }, {
                             text: "Bonus Coupon 🎁",
                              type: "text"

                        }]);
                    }
                }

                /**
                 * Responds to the user's message based on predefined rules or LLM.
                 * @param {string} message - The user's message.
                 */
                async function respondToUser(message) {
                    const lowerCaseMessage = message.toLowerCase();
                    let botResponse = "I'm sorry, I didn't quite understand that. Could you please rephrase or ask something else?";
                    let suggestions = [];

                    // 1. Handle "Next Tip" button click
                    if (lowerCaseMessage === "next tip") {
                        currentHealthTipIndex++;
                        await displayHealthTip(currentHealthTipIndex);
                        return;
                    }
                    // 2. Handle "See all health tips"
                    if (lowerCaseMessage === "see all health tips") {
                        let tipsHtml = `<h3 class="text-xl font-bold text-purple-700 mb-4">All General Health Tips: 💡</h3>`; // Section heading with emoji
                        generalHealthTips.forEach(tip => {
                            tipsHtml += createHealthTipCardHtml(tip); // Use card for each tip
                        });
                        await sendBotMessageWithTyping(tipsHtml);
                        suggestions = [{
                            text: "List all products",
                            type: "text"
                        }, {
                            text: "General health tips 💡",
                            type: "text"
                        }, // Offer to restart tips
                        {
                            text: "Symptom Checker ✨",
                            type: "text"
                        }, {
                            text: "Personalized Product Recommendation ✨",
                            type: "text"
                        }, {
                            text: "Contact support 📞",
                            type: "text"
                        }, {
                             text: "Bonus Coupon 🎁",
                              type: "text"

                        }];
                        displaySuggestions(suggestions);
                        return;
                    }
                    // 3. Handle "Back to main menu"
                    if (lowerCaseMessage === "back to main menu") {
                        await sendBotMessageWithTyping("Welcome back to the main menu! How can I help you further?");
                        suggestions = [{
                            text: "List all products",
                            type: "text"
                        }, {
                            text: "How to make money with Kedi? 💰",
                            type: "text"
                        }, {
                            text: "Tell me about Diabetes",
                            type: "text"
                        }, {
                            text: "General health tips 💡",
                            type: "text"
                        }, {
                            text: "Symptom Checker ✨",
                            type: "text"
                        }, {
                            text: "Personalized Product Recommendation ✨",
                            type: "text"
                        }, {
                            text: "Contact support 📞",
                            type: "text"
                        }, {
                             text: "Bonus Coupon 🎁",
                              type: "text"

                        }];
                        displaySuggestions(suggestions);
                        return;
                    }

                    // 4. Handle "List all products"
                    if (lowerCaseMessage === "list all products") {
                        const groupedProducts = products.reduce((acc, product) => {
                            (acc[product.type] = acc[product.type] || []).push(product);
                            return acc;
                        }, {});

                        let allProductsHtml = `<h3 class="text-xl font-bold text-purple-700 mb-4">Our Products by Category: 🛍️</h3>`; // Section heading with emoji
                        for (const type in groupedProducts) {
                            allProductsHtml += `<h4 class="text-lg font-semibold text-purple-600 mt-4 mb-2">${type}</h4>`;
                            groupedProducts[type].forEach(product => {
                                allProductsHtml += createProductCardHtml(product);
                                suggestions.push({
                                    text: `Tell me about ${product.name}`,
                                    type: "text"
                                });
                            });
                        }
                        await sendBotMessageWithTyping(allProductsHtml);
                        suggestions.push({
                            text: "General health tips 💡",
                            type: "text"
                        }, {
                            text: "Symptom Checker ✨",
                            type: "text"
                        }, {
                            text: "Personalized Product Recommendation ✨",
                            type: "text"
                        });
                        displaySuggestions(suggestions);
                        return;
                    }

                    // 5. Direct Product/Health Condition Lookup (NEW LOGIC)
                    let foundItem = null;
                    // Check products first
                    for (const product of products) {
                        if (lowerCaseMessage.includes(product.name.toLowerCase()) || product.keywords.test(lowerCaseMessage)) {
                            foundItem = { type: 'product', name: product.name };
                            break;
                        }
                    }
                    // If not a product, check health conditions
                    if (!foundItem) {
                        for (const condition of healthConditions) {
                            if (lowerCaseMessage.includes(condition.name.toLowerCase()) || condition.keywords.test(lowerCaseMessage)) {
                                foundItem = { type: 'condition', name: condition.name };
                                break;
                            }
                        }
                    }

                    if (foundItem) {
                        await displayDetailedInfo(foundItem.type, foundItem.name);
                        return; // Exit function after handling direct lookup
                    }


                    // 6. --- Symptom Checker Logic ---
                    if (lowerCaseMessage.includes("symptom checker")) {
                        waitingForSymptoms = true;
                        await sendBotMessageWithTyping("I can help you with a symptom checker. Please list your symptoms, separated by commas (e.g., 'headache, fever, cough'). 🤒"); // Added emoji
                        suggestions.push({
                            text: "Back to main menu",
                            type: "text"
                        });
                        displaySuggestions(suggestions);
                        return;
                    }

                    if (waitingForSymptoms) {
                        const symptoms = lowerCaseMessage.split(',').map(s => s.trim());
                        await sendBotMessageWithTyping("Thank you for providing your symptoms. Let me analyze them to see if I can find a match or provide some general guidance. 🤔"); // Added emoji

                        let matchedConditions = [];
                        healthConditions.forEach(condition => {
                            const conditionKeywords = condition.keywords.source.split('|').map(k => k.replace(/\\/g, '').trim());
                            const commonSymptoms = symptoms.filter(symptom =>
                                conditionKeywords.some(keyword => symptom.includes(keyword))
                            );
                            if (commonSymptoms.length > 0) {
                                matchedConditions.push(condition);
                            }
                        });

                        if (matchedConditions.length > 0) {
                            let conditionsHtml = `<h3 class="text-xl font-bold text-purple-700 mb-4">Possible Health Conditions: 🩺</h3>`; // Section heading with emoji
                            conditionsHtml += `<p class="mb-4">Based on your symptoms, here are some health conditions that might be relevant. Please remember, I am an AI and cannot provide medical diagnoses. Always consult a healthcare professional for accurate diagnosis and treatment:</p>`;
                            matchedConditions.forEach(condition => {
                                conditionsHtml += createHealthConditionCardHtml(condition); // Use the new function here
                            });
                            conditionsHtml += `<small class="text-gray-500"><em>Please note: This information is for general guidance and not a substitute for professional medical diagnosis or treatment. Always consult a healthcare professional for accurate diagnosis and treatment.</em></small>`;
                            await sendBotMessageWithTyping(conditionsHtml);
                        } else {
                            await sendBotMessageWithTyping("I couldn't find a direct match for your symptoms in my database. It's crucial to consult a healthcare professional for any health concerns. Would you like general health tips instead?");
                            suggestions.push({
                                text: "General health tips 💡",
                                type: "text"
                            });
                        }
                        waitingForSymptoms = false; // Reset flag
                        suggestions.push({
                            text: "List all products",
                            type: "text"
                        });
                        suggestions.push({
                            text: "How to make money with Kedi? 💰",
                            type: "text"
                        });
                        suggestions.push({
                            text: "Personalized Product Recommendation ✨",
                            type: "text"
                        });
                        displaySuggestions(suggestions);
                        return;
                    }

                    // 7. --- Personalized Product Recommendation Logic ---
                    if (lowerCaseMessage.includes("personalized product recommendation")) {
                        waitingForHealthGoal = true;
                        await sendBotMessageWithTyping("I can help you find products based on your health goals! Please tell me what health area you are interested in (e.g., 'immunity', 'energy', 'digestion', 'skin health'). 🎯"); // Added emoji
                        suggestions.push({
                            text: "Back to main menu",
                            type: "text"
                        });
                        displaySuggestions(suggestions);
                        return;
                    }

                    if (waitingForHealthGoal) {
                        const healthGoal = lowerCaseMessage;
                        let recommendedProductsSet = new Set(); // Use a Set to store unique products

                        // Function to add products to the set based on keywords
                        const addProductsByKeywords = (keywords) => {
                            products.filter(p => keywords.some(k => healthGoal.includes(k)))
                                .forEach(p => recommendedProductsSet.add(p));
                        };

                        // Enhanced keyword matching for various health goals
                        if (healthGoal.includes("immune") || healthGoal.includes("immunity") || healthGoal.includes("boost health") || healthGoal.includes("fight infection")) {
                            addProductsByKeywords(["reishi", "small reishi", "golden hypha", "small golden hypha"]);
                        }
                        if (healthGoal.includes("energy") || healthGoal.includes("stamina") || healthGoal.includes("vitality") || healthGoal.includes("fatigue")) {
                            addProductsByKeywords(["vigor essential", "cordy active", "small cordy active", "cordy royal jelly", "small cordy royal jelly"]);
                        }
                        if (healthGoal.includes("male sexual health") || healthGoal.includes("libido") || healthGoal.includes("erection") || healthGoal.includes("male performance")) {
                            addProductsByKeywords(["re-vive", "packet re-vive", "vigor essential"]);
                        }
                        if (healthGoal.includes("diabetes") || healthGoal.includes("blood sugar") || healthGoal.includes("glucose")) {
                            addProductsByKeywords(["diawell"]);
                        }
                        if (healthGoal.includes("joint pain") || healthGoal.includes("arthritis") || healthGoal.includes("rheumatic") || healthGoal.includes("bone health")) {
                            addProductsByKeywords(["jointeez"]);
                        }
                        if (healthGoal.includes("weight management") || healthGoal.includes("lose weight") || healthGoal.includes("fat burning") || healthGoal.includes("obesity")) {
                            addProductsByKeywords(["magilim"]);
                        }
                        if (healthGoal.includes("memory") || healthGoal.includes("concentration") || healthGoal.includes("brain") || healthGoal.includes("cognitive function")) {
                            addProductsByKeywords(["memory 24/7 capsule"]);
                        }
                        if (healthGoal.includes("vision") || healthGoal.includes("eye fatigue") || healthGoal.includes("eye health")) {
                            addProductsByKeywords(["eye beta capsule", "refresh tea"]);
                        }
                        if (healthGoal.includes("stomach") || healthGoal.includes("digestion") || healthGoal.includes("ulcers") || healthGoal.includes("gastric")) {
                            addProductsByKeywords(["gastrifort capsule", "constilease", "colon cleanse"]);
                        }
                        if (healthGoal.includes("female reproductive health") || healthGoal.includes("hormonal balance") || healthGoal.includes("pid") || healthGoal.includes("ovarian cysts") || healthGoal.includes("menstrual")) {
                            addProductsByKeywords(["gynapharm capsule", "golden six"]);
                        }
                        if (healthGoal.includes("prostate health") || healthGoal.includes("urinary health male")) {
                            addProductsByKeywords(["lycovite"]);
                        }
                        if (healthGoal.includes("cardiovascular") || healthGoal.includes("heart health") || healthGoal.includes("blood pressure") || healthGoal.includes("cholesterol")) {
                            addProductsByKeywords(["cello q10", "blood circulatory massager"]); // Added BCM
                        }
                        if (healthGoal.includes("blood health") || healthGoal.includes("anemia") || healthGoal.includes("iron deficiency") || healthGoal.includes("blood circulation")) {
                            addProductsByKeywords(["reishi (blood tonic)", "blood circulatory massager"]); // Added BCM
                        }
                        if (healthGoal.includes("oral hygiene") || healthGoal.includes("toothache") || healthGoal.includes("dental pain") || healthGoal.includes("gum health")) {
                            addProductsByKeywords(["gum care toothpaste"]);
                        }
                        if (healthGoal.includes("detox") || healthGoal.includes("cleanse") || healthGoal.includes("liver detox")) {
                            addProductsByKeywords(["refresh tea", "colon cleanse"]);
                        }
                        if (healthGoal.includes("water") || healthGoal.includes("hydration") || healthGoal.includes("alkaline")) {
                            addProductsByKeywords(["hydrogen cup"]);
                        }
                        if (healthGoal.includes("acne") || healthGoal.includes("skin care") || healthGoal.includes("pimple")) {
                            addProductsByKeywords(["sulphur-anti-acne-soap", "pearl-whitening-soap", "nano-silver-antibacterial-soap"]); // All soaps for skin care
                        }
                        if (healthGoal.includes("whitening") || healthGoal.includes("brighten skin") || healthGoal.includes("lighten skin") || healthGoal.includes("pigmentation")) {
                            addProductsByKeywords(["pearl-whitening-soap"]);
                        }
                        if (healthGoal.includes("antibacterial") || healthGoal.includes("germs") || healthGoal.includes("deep cleansing") || healthGoal.includes("skin hygiene")) {
                            addProductsByKeywords(["nano-silver-antibacterial-soap"]);
                        }
                        if (healthGoal.includes("coffee") || healthGoal.includes("healthy coffee") || healthGoal.includes("energy drink")) {
                            addProductsByKeywords(["kedi coffee"]);
                        }


                        const recommendedProducts = Array.from(recommendedProductsSet); // Convert Set back to Array

                        if (recommendedProducts.length > 0) {
                            // Group recommended products by type
                            const groupedProducts = recommendedProducts.reduce((acc, product) => {
                                (acc[product.type] = acc[product.type] || []).push(product);
                                return acc;
                            }, {});

                            let productHtml = `<h3 class="text-xl font-bold text-purple-700 mb-4">Personalized Product Recommendations: ✨</h3>`; // Section heading with emoji
                            productHtml += `<p class="mb-4">Based on your health goal of "${healthGoal}", here are some Kedi Healthcare products you might find beneficial:</p>`;
                            for (const type in groupedProducts) {
                                productHtml += `<h4 class="text-lg font-semibold text-purple-600 mt-4 mb-2">${type}</h4>`;
                                groupedProducts[type].forEach(product => {
                                    productHtml += createProductCardHtml(product);
                                    suggestions.push({
                                        text: `Tell me about ${product.name}`,
                                        type: "text"
                                    });
                                });
                            }
                            productHtml += `<small class="text-gray-500"><em>Please note: These recommendations are based on general health goals and are not a substitute for professional medical advice. Always consult a healthcare professional for personalized guidance.</em></small>`;
                            await sendBotMessageWithTyping(productHtml);
                        } else {
                            await sendBotMessageWithTyping("I couldn't find specific product recommendations for that health goal in my current database. Kedi Healthcare has many products for general well-being. Would you like to see a list of all products or get general health tips?");
                            suggestions.push({
                                text: "List all products",
                                type: "text"
                            });
                            suggestions.push({
                                text: "General health tips 💡",
                                type: "text"
                            });
                        }
                        waitingForHealthGoal = false; // Reset flag
                        suggestions.push({
                            text: "Symptom Checker ✨",
                            type: "text"
                        });
                        suggestions.push({
                            text: "How to make money with Kedi? 💰",
                            type: "text"
                        });
                        displaySuggestions(suggestions);
                        return;
                    }

                    // 8. Handle "General health tips"
                    if (lowerCaseMessage.includes("general health tips")) {
                        currentHealthTipIndex = 0; // Reset to first tip
                        await displayHealthTip(currentHealthTipIndex);
                        return;
                    }

                    // 9. Handle general FAQs
                    for (const faq of faqs) {
                        if (faq.q.test(lowerCaseMessage)) {
                            await sendBotMessageWithTyping(faq.a);
                            // Always offer general suggestions after an FAQ response
                            displaySuggestions([{
                                text: "List all products",
                                type: "text"
                            }, {
                                text: "How to make money with Kedi? 💰",
                                type: "text"
                            }, {
                                text: "General health tips 💡",
                                type: "text"
                            }, {
                                text: "Symptom Checker ✨",
                            }, {
                                text: "Personalized Product Recommendation ✨",
                                type: "text"
                            }, {
                                text: "Contact support 📞",
                                type: "text"
                            }, {
                                text: "Bonus Coupon 🎁",
                                type: "text"
                            }]);
                            return; // Exit function after handling FAQ
                        }
                    }


                    // 10. Fallback to LLM if no specific match
                    // Remove any existing typing indicators before making a new one
                    const existingTypingIndicators = chatbotMessages.querySelectorAll('.typing-indicator');
                    existingTypingIndicators.forEach(indicator => indicator.remove());

                    // Display "thinking" message
                    await sendBotMessageWithTyping("Let me think about that for a moment... 🤔"); // Added emoji
                    console.log('Initiating Gemini API call...'); // Debug log
                    try {
                        const chatHistory = [{
                            role: "user",
                            parts: [{
                                text: message
                            }]
                        }];
                        const payload = {
                            contents: chatHistory
                        };
                        const response = await fetch(API_URL, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(payload)
                        });
                        console.log('Gemini API response received, status:', response.status); // Debug log
                        const result = await response.json();
                        console.log('Gemini API response JSON:', result); // Debug log

                        if (result.candidates && result.candidates.length > 0 &&
                            result.candidates[0].content && result.candidates[0].content.parts &&
                            result.candidates[0].content.parts.length > 0) {
                            botResponse = result.candidates[0].content.parts[0].text;
                        } else {
                            botResponse = "I'm having trouble connecting to my knowledge base right now. Please try again later or ask a different question. 🚧"; // Added emoji
                            console.warn('Gemini API response structure unexpected or empty.'); // Debug log
                        }
                    } catch (error) {
                        console.error("Error calling Gemini API:", error); // Debug log
                        botResponse = "I'm currently experiencing technical difficulties and cannot process your request. Please try again in a moment. 🛠️"; // Added emoji
                    }

                    // Added disclaimer for LLM generated responses
                    await sendBotMessageWithTyping(`${botResponse}<br><br><small class="text-gray-500"><em>Please note: This information is AI-generated and for general informational purposes only. It is not medical advice. Always consult a healthcare professional for specific health concerns.</em></small>`);
                    // Always offer general suggestions after an LLM response
                    displaySuggestions([{
                        text: "List all products",
                        type: "text"
                    }, {
                        text: "How to make money with Kedi? 💰",
                        type: "text"
                    }, {
                        text: "General health tips 💡",
                        type: "text"
                    }, {
                        text: "Symptom Checker ✨",
                    }, {
                        text: "Personalized Product Recommendation ✨",
                        type: "text"
                    }, {
                        text: "Contact support 📞",
                        type: "text"
                    }, {
                        text: "Bonus Coupon 🎁",
                        type: "text"

                    }]);
                }
            });

            // --- LLM Feature Modal Logic (retained from previous version) ---

            // DOM Element References for Modal (these are outside the main chatbot.js scope but are needed)
            const llmModalOverlay = document.getElementById('llm-modal-overlay');
            const llmModalCloseButton = document.getElementById('llm-modal-close-button');
            const llmModalTitle = document.getElementById('llm-modal-title');
            const llmModalBody = document.getElementById('llm-modal-body');
            const llmModalLoading = document.getElementById('llm-loading-indicator');

            // Function to open the LLM output modal
            function openLlmModal(title, content) {
                llmModalTitle.textContent = title;
                llmModalBody.innerHTML = content; // Use innerHTML to render formatted text
                llmModalOverlay.classList.add('active');
            }

            // Function to close the LLM output modal
            function closeLlmModal() {
                llmModalOverlay.classList.remove('active');
                llmModalTitle.textContent = '';
                llmModalBody.innerHTML = '';
                llmModalLoading.classList.add('hidden'); // Ensure loading is hidden on close
            }

            // Event listener for closing modal
            llmModalCloseButton.addEventListener('click', closeLlmModal);
            llmModalOverlay.addEventListener('click', (event) => {
                if (event.target === llmModalOverlay) {
                    closeLlmModal();
                }
            });

            // === Function to Show Coupon Code ===
async function showCoupon() {
    const coupon = "123556"; // Fixed 6-digit coupon
    let responseHtml = `
        <h3 class="text-xl font-bold text-purple-700 mb-4">🎉 Your Kedi Bonus Coupon</h3>
        <p><strong>Coupon Code:</strong> 
           <span class="bg-yellow-300 text-black px-2 py-1 rounded font-mono text-lg">${coupon}</span>
        </p>
        <p class="mt-2 text-gray-700">Use this coupon during registration to enjoy a special bonus as a new user.</p>
    `;
    await sendBotMessageWithTyping(responseHtml);
}

// === Update respondToUser() ===
async function respondToUser(message) {
    const lowerCaseMessage = message.toLowerCase();

    // Handle Bonus Coupon
    if (lowerCaseMessage.includes("bonus coupon") || lowerCaseMessage.includes("new user coupon")) {
        await showCoupon();
        return;
    }

    // ... keep existing logic
}


            // Function to call Gemini API for LLM features (summarize/FAQ) - retained and adapted
            async function callGeminiForLlmFeature(promptText, modalTitle, isStructuredResponse = false) {
                openLlmModal(modalTitle, ''); // Open modal with title, empty body
                llmModalLoading.classList.remove('hidden'); // Show loading indicator

                try {
                    let payload = { contents: [{ role: "user", parts: [{ text: promptText }] }] };
                    const apiKey = ""; // Canvas will automatically provide this at runtime
                    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

                    if (isStructuredResponse) {
                        payload.generationConfig = {
                            responseMimeType: "application/json",
                            responseSchema: {
                                type: "ARRAY",
                                items: {
                                    type: "OBJECT",
                                    properties: {
                                        "question": { "type": "STRING" },
                                        "answer": { "type": "STRING" }
                                    },
                                    "propertyOrdering": ["question", "answer"]
                                }
                            }
                        };
                    }

                    const response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                    if (!response.ok) {
                        const errorBody = await response.text();
                        throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
                    }

                    const result = await response.json();
                    llmModalLoading.classList.add('hidden'); // Hide loading indicator

                    if (result.candidates && result.candidates.length > 0 &&
                        result.candidates[0].content && result.candidates[0].content.parts &&
                        result.candidates[0].content.parts.length > 0) {
                        let content = result.candidates[0].content.parts[0].text;

                        if (isStructuredResponse) {
                            try {
                                const parsedJson = JSON.parse(content);
                                let formattedContent = '';
                                if (Array.isArray(parsedJson)) {
                                    parsedJson.forEach(item => {
                                        if (item.question && item.answer) {
                                            formattedContent += `<p class="font-semibold text-lg mt-4 mb-2">${item.question}</p><p>${item.answer}</p>`;
                                        }
                                    });
                                }
                                llmModalBody.innerHTML = formattedContent || '<p>No structured content available.</p>';
                            } catch (jsonError) {
                                llmModalBody.innerHTML = `<p class="text-red-500">Error parsing structured response: ${jsonError.message}</p><p>Raw response: ${content}</p>`;
                                console.error('Error parsing JSON from Gemini API:', jsonError);
                            }
                        } else {
                            llmModalBody.innerHTML = content.replace(/\n/g, '<br>'); // Render newlines as <br>
                        }
                    } else {
                        llmModalBody.innerHTML = '<p class="text-red-500">Sorry, I could not generate content. The AI provided an empty or malformed response. 🤔</p>';
                        console.error('Gemini API response structure unexpected or empty:', result);
                    }
                } catch (error) {
                    llmModalLoading.classList.add('hidden'); // Hide loading indicator
                    llmModalBody.innerHTML = `<p class="text-red-500">Error communicating with the AI: ${error.message}. Please try again later. 🚧</p>`;
                    console.error('Error calling Gemini API for LLM feature:', error);
                }
            }
        })();
// ...existing code...

// --- Add Kedi Health Centres Data ---
// (Duplicate declaration removed)

// --- Helper to show states ---
async function showStates() {
    await sendBotMessageWithTyping(`<strong>Select your state to view Kedi Healthcare Centres:</strong>`);
    const suggestions = Object.keys(healthCenters).map(state => ({
        text: state,
        type: "text",
        action: "select-state"
    }));
    displaySuggestions(suggestions);
}

// --- Helper to show centers for a state ---
async function showCentersForState(state) {
    const centers = healthCenters[state];
    if (!centers) {
        await sendBotMessageWithTyping(`Sorry, no Kedi Healthcare Centres found for "${state}".`);
        return;
    }
    let html = `<h3 class="text-xl font-bold text-purple-700 mb-4">Kedi Healthcare Centres in ${state}</h3>`;
    centers.forEach((center, idx) => {
        html += `<div class="mb-3">
            <strong>Service Center ${idx + 1}:</strong><br>
            <span class="text-gray-700">${center.address}</span><br>
            <span class="text-green-700">Admin Phone: ${center.admin}</span>
        </div>`;
    });
    html += `<p class="mt-2 text-gray-700">Use sponsor code <span class="bg-yellow-300 text-black px-2 py-1 rounded font-mono text-lg">1234456</span> to register as a new user.</p>`;
    await sendBotMessageWithTyping(html);
    displaySuggestions([
        { text: "Back to states", type: "text", action: "back-to-states" },
        { text: "Back to main menu", type: "text" }
    ]);
}

// --- Update handleOpenChatbot to ask membership and show health centre button ---
async function handleOpenChatbot() {
    chatbotWindow.classList.remove('hidden');
    chatbotWindow.classList.add('open');
    openBtn.classList.add('hidden');
    if (!hasGreeted) {
        // ...existing greeting logic...
        await sendBotMessageWithTyping(`${greeting} ${emoji}! I'm your Kedi Healthcare Assistant. I'm here to help you with:
            <ul>
                <li>Product information and benefits 💊</li>
                <li>Insights into various health conditions 🩺</li>
                <li>How to start your own Kedi business 💰</li>
                <li>General health tips and FAQs ❓</li>
            </ul>
            How can I help you today?`);

        // Ask if user is a Kedi member
        await sendBotMessageWithTyping(`<strong>Are you a Kedi member?</strong>`);
        displaySuggestions([
            { text: "Yes, I am a Kedi member", type: "text", action: "kedi-member-yes" },
            { text: "No, I am not a Kedi member", type: "text", action: "kedi-member-no" },
            { text: "Find Healthcare Centres 🌍", type: "text", action: "find-healthcare-centres" }
        ]);
        hasGreeted = true;
    }
}

// --- Update respondToUser for health centre flow ---
async function respondToUser(message) {
    const lowerCaseMessage = message.toLowerCase();

    // Coupon code logic (already present)
    if (lowerCaseMessage.includes("bonus coupon") || lowerCaseMessage.includes("new user coupon") || lowerCaseMessage.includes("sponsor code")) {
        await sendBotMessageWithTyping(`<strong>Your Kedi Sponsor Code:</strong> <span class="bg-yellow-300 text-black px-2 py-1 rounded font-mono text-lg">1234456</span><br>Use this code to register as a new user and enjoy your bonus!`);
        return;
    }

    // Membership response
    if (lowerCaseMessage.includes("kedi member")) {
        await sendBotMessageWithTyping("Thank you for your response! You can find Kedi Healthcare Centres worldwide. Please click below to choose your location.");
        displaySuggestions([
            { text: "Find Healthcare Centres 🌍", type: "text", action: "find-healthcare-centres" }
        ]);
        return;
    }

    // Find Healthcare Centres button
    if (lowerCaseMessage.includes("find healthcare centres")) {
        await showStates();
        return;
    }

    // State selection
    if (healthCenters[message]) {
        await showCentersForState(message);
        return;
    }

    // Back to states
    if (lowerCaseMessage === "back to states") {
        await showStates();
        return;
    }
// ...existing code...

// Utility to inject "Find all health centres" into suggestions
function addFindAllHealthCentres(suggestions) {
    suggestions.push({
        text: "Find all health centres 🌍",
        type: "text",
        action: "find-healthcare-centres"
    });
    return suggestions;
}

// Update all displaySuggestions calls to include "Find all health centres"
// Example for respondToUser FAQ section:
for (const faq of faqs) {
    if (faq.q.test(lowerCaseMessage)) {
        await sendBotMessageWithTyping(faq.a);
        // Always offer general suggestions after an FAQ response
        let suggestions = [{
            text: "List all products",
            type: "text"
        }, {
            text: "How to make money with Kedi? 💰",
            type: "text"
        }, {
            text: "General health tips 💡",
            type: "text"
        }, {
            text: "Symptom Checker ✨",
        }, {
            text: "Personalized Product Recommendation ✨",
            type: "text"
        }, {
            text: "Contact support 📞",
            type: "text"
        }, {
            text: "Bonus Coupon 🎁",
            type: "text"
        }];
        displaySuggestions(addFindAllHealthCentres(suggestions));
        return; // Exit function after handling FAQ
    }
}

// Do the same for all other displaySuggestions calls in respondToUser and elsewhere:
// Example for main menu:
if (lowerCaseMessage === "back to main menu") {
    await sendBotMessageWithTyping("Welcome back to the main menu! How can I help you further?");
    let suggestions = [{
        text: "List all products",
        type: "text"
    }, {
        text: "How to make money with Kedi? 💰",
        type: "text"
    }, {
        text: "Tell me about Diabetes",
        type: "text"
    }, {
        text: "General health tips 💡",
        type: "text"
    }, {
        text: "Symptom Checker ✨",
        type: "text"
    }, {
        text: "Personalized Product Recommendation ✨",
        type: "text"
    }, {
        text: "Contact support 📞",
        type: "text"
    }, {
        text: "Bonus Coupon 🎁",
        type: "text"
    }];
    displaySuggestions(addFindAllHealthCentres(suggestions));
    return;
}

// Repeat this pattern for all displaySuggestions calls throughout your chatbot logic.

// ...existing code...
    // ...existing logic...
}

// ...existing code...// ...existing code...


// --- Helper to show states ---
async function showStates() {
    await sendBotMessageWithTyping(`<strong>Select your state to view Kedi Healthcare Centres:</strong>`);
    const suggestions = Object.keys(healthCenters).map(state => ({
        text: state,
        type: "text",
        action: "select-state"
    }));
    displaySuggestions(suggestions);
}

// --- Helper to show centers for a state ---
async function showCentersForState(state) {
    const centers = healthCenters[state];
    if (!centers) {
        await sendBotMessageWithTyping(`Sorry, no Kedi Healthcare Centres found for "${state}".`);
        return;
    }
    let html = `<h3 class="text-xl font-bold text-purple-700 mb-4">Kedi Healthcare Centres in ${state}</h3>`;
    centers.forEach((center, idx) => {
        html += `<div class="mb-3">
            <strong>Service Center ${idx + 1}:</strong><br>
            <span class="text-gray-700">${center.address}</span><br>
            <span class="text-green-700">Admin Phone: ${center.admin}</span>
        </div>`;
    });
    html += `<p class="mt-2 text-gray-700">Use sponsor code <span class="bg-yellow-300 text-black px-2 py-1 rounded font-mono text-lg">1234456</span> to register as a new user.</p>`;
    await sendBotMessageWithTyping(html);
    displaySuggestions([
        { text: "Back to states", type: "text", action: "back-to-states" },
        { text: "Back to main menu", type: "text" }
    ]);
}

// --- Update handleOpenChatbot to ask membership and show health centre button ---
async function handleOpenChatbot() {
    chatbotWindow.classList.remove('hidden');
    chatbotWindow.classList.add('open');
    openBtn.classList.add('hidden');
    if (!hasGreeted) {
        // ...existing greeting logic...
        await sendBotMessageWithTyping(`${greeting} ${emoji}! I'm your Kedi Healthcare Assistant. I'm here to help you with:
            <ul>
                <li>Product information and benefits 💊</li>
                <li>Insights into various health conditions 🩺</li>
                <li>How to start your own Kedi business 💰</li>
                <li>General health tips and FAQs ❓</li>
            </ul>
            How can I help you today?`);

        // Ask if user is a Kedi member
        await sendBotMessageWithTyping(`<strong>Are you a Kedi member?</strong>`);
        displaySuggestions([
            { text: "Yes, I am a Kedi member", type: "text", action: "kedi-member-yes" },
            { text: "No, I am not a Kedi member", type: "text", action: "kedi-member-no" },
            { text: "Find Healthcare Centres 🌍", type: "text", action: "find-healthcare-centres" }
        ]);
        hasGreeted = true;
    }
}

// --- Update respondToUser for health centre flow ---
async function respondToUser(message) {
    const lowerCaseMessage = message.toLowerCase();

    // Coupon code logic (already present)
    if (lowerCaseMessage.includes("bonus coupon") || lowerCaseMessage.includes("new user coupon") || lowerCaseMessage.includes("sponsor code")) {
        await sendBotMessageWithTyping(`<strong>Your Kedi Sponsor Code:</strong> <span class="bg-yellow-300 text-black px-2 py-1 rounded font-mono text-lg">1234456</span><br>Use this code to register as a new user and enjoy your bonus!`);
        return;
    }

    // Membership response
    if (lowerCaseMessage.includes("kedi member")) {
        await sendBotMessageWithTyping("Thank you for your response! You can find Kedi Healthcare Centres worldwide. Please click below to choose your location.");
        displaySuggestions([
            { text: "Find Healthcare Centres 🌍", type: "text", action: "find-healthcare-centres" }
        ]);
        return;
    }

    // Find Healthcare Centres button
    if (lowerCaseMessage.includes("find healthcare centres")) {
        await showStates();
        return;
    }

    // State selection
    if (healthCenters[message]) {
        await showCentersForState(message);
        return;
    }

    // Back to states
    if (lowerCaseMessage === "back to states") {
        await showStates();
        return;
    }

    // ...existing logic...
}

// ...existing code...// ...existing code...

// --- Add Kedi Health Centres Data ---
const healthCenters = {
    "Lagos": [
        { address: "No. 12, Allen Avenue, Ikeja, Lagos", admin: "+234 803 123 4567" },
        { address: "Plot 5, Victoria Island, Lagos", admin: "+234 805 987 6543" }
    ],
    "Abuja": [
        { address: "Suite 21, Garki Mall, Abuja", admin: "+234 802 345 6789" }
    ],
    "Kano": [
        { address: "No. 7, Zoo Road, Kano", admin: "+234 806 234 5678" }
    ]
    // Add more states and centers as needed
};

// --- Helper to show states ---
async function showStates() {
    await sendBotMessageWithTyping(`<strong>Select your state to view Kedi Healthcare Centres:</strong>`);
    const suggestions = Object.keys(healthCenters).map(state => ({
        text: state,
        type: "text",
        action: "select-state"
    }));
    displaySuggestions(suggestions);
}

// --- Helper to show centers for a state ---
async function showCentersForState(state) {
    const centers = healthCenters[state];
    if (!centers) {
        await sendBotMessageWithTyping(`Sorry, no Kedi Healthcare Centres found for "${state}".`);
        return;
    }
    let html = `<h3 class="text-xl font-bold text-purple-700 mb-4">Kedi Healthcare Centres in ${state}</h3>`;
    centers.forEach((center, idx) => {
        html += `<div class="mb-3">
            <strong>Service Center ${idx + 1}:</strong><br>
            <span class="text-gray-700">${center.address}</span><br>
            <span class="text-green-700">Admin Phone: ${center.admin}</span>
        </div>`;
    });
    html += `<p class="mt-2 text-gray-700">Use sponsor code <span class="bg-yellow-300 text-black px-2 py-1 rounded font-mono text-lg">1234456</span> to register as a new user.</p>`;
    await sendBotMessageWithTyping(html);
    displaySuggestions([
        { text: "Back to states", type: "text", action: "back-to-states" },
        { text: "Back to main menu", type: "text" }
    ]);
}

// --- Update handleOpenChatbot to ask membership and show health centre button ---
async function handleOpenChatbot() {
    chatbotWindow.classList.remove('hidden');
    chatbotWindow.classList.add('open');
    openBtn.classList.add('hidden');
    if (!hasGreeted) {
        // ...existing greeting logic...
        await sendBotMessageWithTyping(`${greeting} ${emoji}! I'm your Kedi Healthcare Assistant. I'm here to help you with:
            <ul>
                <li>Product information and benefits 💊</li>
                <li>Insights into various health conditions 🩺</li>
                <li>How to start your own Kedi business 💰</li>
                <li>General health tips and FAQs ❓</li>
            </ul>
            How can I help you today?`);

        // Ask if user is a Kedi member
        await sendBotMessageWithTyping(`<strong>Are you a Kedi member?</strong>`);
        displaySuggestions([
            { text: "Yes, I am a Kedi member", type: "text", action: "kedi-member-yes" },
            { text: "No, I am not a Kedi member", type: "text", action: "kedi-member-no" },
            { text: "Find Healthcare Centres 🌍", type: "text", action: "find-healthcare-centres" }
        ]);
        hasGreeted = true;
    }
}

// --- Update respondToUser for health centre flow ---
async function respondToUser(message) {
    const lowerCaseMessage = message.toLowerCase();

    // Coupon code logic (already present)
    if (lowerCaseMessage.includes("bonus coupon") || lowerCaseMessage.includes("new user coupon") || lowerCaseMessage.includes("sponsor code")) {
        await sendBotMessageWithTyping(`<strong>Your Kedi Sponsor Code:</strong> <span class="bg-yellow-300 text-black px-2 py-1 rounded font-mono text-lg">1234456</span><br>Use this code to register as a new user and enjoy your bonus!`);
        return;
    }

    // Membership response
    if (lowerCaseMessage.includes("kedi member")) {
        await sendBotMessageWithTyping("Thank you for your response! You can find Kedi Healthcare Centres worldwide. Please click below to choose your location.");
        displaySuggestions([
            { text: "Find Healthcare Centres 🌍", type: "text", action: "find-healthcare-centres" }
        ]);
        return;
    }

    // Find Healthcare Centres button
    if (lowerCaseMessage.includes("find healthcare centres")) {
        await showStates();
        return;
    }

    // State selection
    if (healthCenters[message]) {
        await showCentersForState(message);
        return;
    }

    // Back to states
    if (lowerCaseMessage === "back to states") {
        await showStates();
        return;
    }

    // ...existing logic...
}

// ...existing code...