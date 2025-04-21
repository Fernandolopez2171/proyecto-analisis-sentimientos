from transformers import BertModel, BertTokenizer, get_linear_schedule_with_warmup
import torch
import numpy as np
from torch.optim import AdamW
from sklearn.model_selection import train_test_split
from torch import nn, optim
from torch.utils.data import Dataset, DataLoader
import pandas as pd
from textwrap import wrap
import torch.nn.functional as F
import os
import csv

RANDOM_SEED = 42
MAX_LEN = 200
BATCH_SIZE = 16
NCLASSES = 3
PRE_TRAINED_MODEL_NAME = 'bert-base-cased'

tokenizer = BertTokenizer.from_pretrained(PRE_TRAINED_MODEL_NAME)
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')


class BERTSentimentClassifier(nn.Module):
  def __init__(self, n_classes):
    super(BERTSentimentClassifier, self).__init__()
    self.bert = BertModel.from_pretrained(PRE_TRAINED_MODEL_NAME)
    self.drop = nn.Dropout(p=0.3)
    self.linear = nn.Linear(self.bert.config.hidden_size, n_classes)

  def forward(self, input_ids, attention_mask):
    outputs = self.bert(
        input_ids = input_ids,
        attention_mask = attention_mask
    )
    cls_output = outputs[1]
    drop_output = self.drop(cls_output)
    output = self.linear(drop_output)
    return output

model = BERTSentimentClassifier(NCLASSES)
current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(current_dir, 'model.pth')

model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))
model = model.to(device)

def classifySentiment(review_text):
    encoding_review = tokenizer.encode_plus(
      review_text,
      max_length = MAX_LEN,
      truncation = True,
      add_special_tokens = True,
      return_token_type_ids = False,
      padding='longest',
      return_attention_mask = True,
      return_tensors = 'pt'
      )

    input_ids = encoding_review['input_ids'].to(device)
    attention_mask = encoding_review['attention_mask'].to(device)
    output = model(input_ids, attention_mask)
    _, prediction = torch.max(output, dim=1)

    if prediction == 0:
        return "negative"
    elif prediction == 1:
        return "neutral"
    else:
        return "positive"

def feedbackFunction(review_text, correct_label=None):
    sentiment = classifySentiment(review_text)
    if sentiment != correct_label:
        with open('feedback_data.csv', 'a', newline='') as f:
            writer = csv.writer(f)
            
            if f.tell() == 0:
                writer.writerow(['review', 'sentiment'])
            
            writer.writerow([review_text, correct_label])