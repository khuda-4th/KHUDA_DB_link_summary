from flask import Flask, request, jsonify
import pandas as pd 
import numpy as np
from keybert import KeyBERT
import itertools
from konlpy.tag import Okt
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import nltk
from flask_cors import CORS
nltk.download('punkt')

model_dir = "lcw99/t5-base-korean-text-summary"
tokenizer_t5 = AutoTokenizer.from_pretrained(model_dir)
model_t5 = AutoModelForSeq2SeqLM.from_pretrained(model_dir)

max_input_length = 512
app = Flask(__name__)
CORS(app)
# 한국어를 포함하고 있는 다국어 SBERT 를 로드
model_sbert = SentenceTransformer('sentence-transformers/xlm-r-100langs-bert-base-nli-stsb-mean-tokens')

def keyword_func(doc, top_n, nr_candidates):
  # 형태소 분석기를 통해 명사만 추출한 문서 만들기
  okt = Okt()
  tokenized_doc = okt.pos(doc)
  tokenized_nouns = ' '.join([word[0] for word in tokenized_doc if word[1] == 'Noun'])

  # 사이킷런의 CountVectorizer를 사용해 단어 추출 / 이유: n_gram_range의 인자를 사용하면 쉽게 n-gram 추출이 가능하기 때문
  n_gram_range = (1, 2) # 결과 후보는 2 개의 단어를 한 묶음으로 간주하는 bigram 과 3 개의 단어를 한 묶음으로 간주하는 trigram 을 추출
  count = CountVectorizer(ngram_range=n_gram_range).fit([tokenized_nouns])
  candidates = count.get_feature_names_out()
  doc_embedding = model_sbert.encode([doc]) # 문서 encoding하기
  candidate_embeddings = model_sbert.encode(candidates) # 추출된 단어 인코딩하기

  # 문서와 각 키워드들 간의 유사도
  distances = cosine_similarity(doc_embedding, candidate_embeddings)

  # 각 키워드들 간의 유사도
  distances_candidates = cosine_similarity(candidate_embeddings, candidate_embeddings)

  # 코사인유사도에 기반하여 키워드들 중 상위 top_n개의 단어를 pick.
  words_idx = list(distances.argsort()[0][-nr_candidates:])
  words_vals = [candidates[index] for index in words_idx]
  distances_candidates = distances_candidates[np.ix_(words_idx, words_idx)]

  # 각 키워드들중에서 가장 덜 유사한 키워드들 간의 조합을 계산 (# 상위 10 개의 키워드를 선택하고 이 10 개 중에서 서로 가장 유사성이 낮은 5 개를 선택)
  min_sim = np.inf

  candidate = None
  for combination in itertools.combinations(range(len(words_idx)), top_n):
    sim = sum([distances_candidates[i][j] for i in combination for j in combination if i != j])
    if sim < min_sim:
      candidate = combination
      min_sim = sim
  blog_keyword = [words_vals[idx] for idx in candidate]

  return blog_keyword
    
# 요약 스트링 반환
def summarization(text):
    inputs = ["summarize: " + text]
    inputs = tokenizer_t5(inputs, max_length=max_input_length, truncation=True, return_tensors="pt")
    output = model_t5.generate(**inputs, num_beams=8, max_length=100, length_penalty=2.0, num_return_sequences=1, no_repeat_ngram_size=2)
    decoded_output = tokenizer_t5.batch_decode(output, skip_special_tokens=True)[0]
    predicted_title = nltk.sent_tokenize(decoded_output.strip())[0]

    return predicted_title

@app.route('/', methods=['POST'])
def summarize():
    data = request.get_json() # request에서 JSON 데이터를 가져오려면 get_json() 메서드를 사용합니다.
    input_text = data.get('content', '')  # 'content' 키로부터 데이터를 추출합니다.  # 'content' 키로부터 데이터를 추출합니다.
    print(input_text)
    # 텍스트 요약 함수 호출
    keyword_list = keyword_func(input_text, top_n=3, nr_candidates=24)
    summary_result = summarization(input_text)
    return jsonify({'summary': summary_result, 'keyword': keyword_list})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
