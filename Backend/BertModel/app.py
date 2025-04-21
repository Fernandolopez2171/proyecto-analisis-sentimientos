from flask import Flask, request, jsonify
from model import classifySentiment, feedbackFunction
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    review_texts = data.get('review_texts')
    if not review_texts:
        return jsonify({'error': 'No review_texts field provided'}), 400

    positive_count = 0
    negative_count= 0
    neutral_count = 0
    totalData=len(review_texts)

    
    for review_text in review_texts:
        sentiment = classifySentiment(review_text)
        
        if sentiment == 'positive':  
            positive_count += 1
        elif sentiment == 'negative':
            negative_count += 1
        else:
            neutral_count += 1

        positive_percentage = positive_count / totalData * 100
        negative_percentage = negative_count / totalData * 100
        neutral_percentage = neutral_count / totalData * 100
    
    
    result = {
        'positive': positive_percentage,
        'positive_count': positive_count,
        'negative': negative_percentage,
        'negative_count': negative_count,
        'neutral': neutral_percentage,
        'neutral_count': neutral_count
    }
    return jsonify(result)

@app.route('/feedback', methods=['POST'])
def feedback():
    data = request.get_json()
    review_text = data.get('review_text')
    correct_label = data.get('correct_label')
    
    if not review_text or not correct_label:
        return jsonify({'error': 'No review_text or correct_label field provided'}), 400

    feedbackFunction(review_text, correct_label=correct_label)

    return jsonify({'success': 'Feedback received'}), 200

if __name__ == '__main__':
    app.run(debug=True)

#-----------------------------------------------------
