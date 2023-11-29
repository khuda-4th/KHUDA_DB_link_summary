import numpy as np
import pandas as pd
import streamlit as st

json_data = [
    {'title' : '제목입니다.',
    'summary' : '이렇궁저렇궁이렇궁저렇궁',
    'keyword' : ['CS', 'Khuda', '이렇궁'],
    'url' : 'https://velog.io/@so_yeong',
    'img' : 'img_link'
    },

   {
    'title' : '제목입니다.1',
    'summary' : '이렇궁저렇궁이렇궁저렇궁1',
    'keyword' : ['CS1', 'Khuda1', '머신러닝'],
    'url' : 'https://velog.io/@so_yeong',
    'img' : 'img_link'
    }, 

   {
    'title' : '제목입니다.1',
    'summary' : '이렇궁저렇궁이렇궁저렇궁1',
    'keyword' : ['AI', 'Khuda1', '이렇궁1'],
    'url' : 'https://velog.io/@so_yeong',
    'img' : 'img_link'
    }, 
   {
    'title' : '제목입니다.1',
    'summary' : '이렇궁저렇궁이렇궁저렇궁1',
    'keyword' : ['AI', 'Khuda1', '이렇궁1'],
    'url' : 'https://velog.io/@so_yeong',
    'img' : 'img_link'
    }, 
   {
    'title' : '제목입니다.1',
    'summary' : '이렇궁저렇궁이렇궁저렇궁1',
    'keyword' : ['AI', 'Khuda1', '이렇궁1'],
    'url' : 'https://velog.io/@so_yeong',
    'img' : 'img_link'
    }, 
   {
    'title' : '제목입니다.1',
    'summary' : '이렇궁저렇궁이렇궁저렇궁1',
    'keyword' : ['AI', 'Khuda1', '이렇궁1'],
    'url' : 'https://velog.io/@so_yeong',
    'img' : 'img_link'
    }, 
   {
    'title' : '제목입니다.1',
    'summary' : '이렇궁저렇궁이렇궁저렇궁1',
    'keyword' : ['AI', 'Khuda1', '이렇궁1'],
    'url' : 'https://velog.io/@so_yeong',
    'img' : 'img_link'
    }, 
   {
    'title' : '제목입니다.1',
    'summary' : '이렇궁저렇궁이렇궁저렇궁1',
    'keyword' : ['AI', 'Khuda1', '이렇궁1'],
    'url' : 'https://velog.io/@so_yeong',
    'img' : 'img_link'
    }, 
]
url = 'https://velog.io/@so_yeong'
df = pd.DataFrame(json_data)

def truncate_text(text, max_length = 50):
    if len(text) <= max_length:
        return text
    else:
        return text[:max_length-3] + "..."

st.title('LINK')
st.caption('Link Is Not Kind')
# 'keyword' 필드의 요소들을 중복 없이 추출
tag_list = list({keyword for entry in json_data for keyword in entry['keyword']})
select = st.multiselect(
    'Select Keywords',
    tag_list)

if select:
    filtered_df = df[df['keyword'].apply(lambda x: any(keyword in x for keyword in select))]
    url_cnt = len(filtered_df)
    col1, col2, col3 = st.columns(3)


    with col1:
        for i in range(0, url_cnt, 3):
            with st.container():
                st.image("img/test_img.png", width=220, use_column_width=100)
                st.write(f'**[{filtered_df["title"].iloc[i]}]({url})**')
                st.write(truncate_text(filtered_df['summary'].iloc[i]))

    with col2:
        for i in range(1, url_cnt, 3):
            with st.container():
                st.image("img/test_img.png", width=220, use_column_width=100)
                st.write(f'**[{filtered_df["title"].iloc[i]}]({url})**')
                st.write(truncate_text(filtered_df['summary'].iloc[i]))

    with col3:
        for i in range(2, url_cnt, 3):
            with st.container():
                st.image("img/test_img.png", width=220, use_column_width=100)
                st.write(f'**[{filtered_df["title"].iloc[i]}]({url})**')
                st.write(truncate_text(filtered_df['summary'].iloc[i]))

else:
    col1, col2, col3 = st.columns(3)
    with col1:
        for i in range(0, len(df), 3):
            with st.container():
                st.image("img/test_img.png", width=220, use_column_width=100)
                st.write(f'**[{df["title"].iloc[i]}]({url})**')
                st.write(truncate_text(df['summary'].iloc[i]))

    with col2:
        for i in range(1, len(df), 3):
            with st.container():
                st.image("img/test_img.png", width=220, use_column_width=100)
                st.write(f'**[{df["title"].iloc[i]}]({url})**')
                st.write(truncate_text(df['summary'].iloc[i]))

    with col3:
        for i in range(2, len(df), 3):
            with st.container():
                st.image("img/test_img.png", width=220, use_column_width=100)
                st.write(f'**[{df["title"].iloc[i]}]({url})**')
                st.write(truncate_text(df['summary'].iloc[i]))