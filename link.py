import numpy as np
import pandas as pd
import streamlit as st
from st_pages import Page, show_pages, add_page_title, Section

st.title('LINK')
st.caption('Link Is Not Kind')

st.sidebar.title('Tags')
tag_list = ['CS', '머신러닝', 'AI', 'KHUDA']

article = {'title' : ['cs지식과 khuda'],
           'summary' : ['이렇궁저렇궁'],
           'keyword' : [['CS', 'KHUDA', '머신러닝']]}

url = 'https://velog.io/@so_yeong'

for tag in tag_list:
    globals()["tag_{}".format(tag)] = st.sidebar.checkbox(tag)

for tag in tag_list:
    if globals()["tag_{}".format(tag)] :
        st.sidebar.write('{}'.format(tag))


def truncate_text(text, max_length = 50):
    if len(text) <= max_length:
        return text
    else:
        return text[:max_length-3] + "..."


# with st.container():
#    st.write("This is inside the container")
#    st.image("https://static.streamlit.io/examples/cat.jpg")

col1, col2, col3 = st.columns(3)


with col1:
   with st.container():
    st.image("img/test_img.png", width=220, use_column_width=100)
    st.write('**[titletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitletitle](%s)**' %url)
    st.write(truncate_text('summarysummarysummarysummarysummarysummarysummarysummarysummarysummarysummarysummary'))

   with st.container():
    st.image("img/test_img.png", width=220, use_column_width=100)
    st.write('**[title](%s)**' %url)
    st.write('summarysummarysummarysummarysummarysummary')


with col2:
   with st.container():
    st.image("img/test_img.png", width=220, use_column_width=100)
    st.write('**[title](%s)**' %url)
    st.write('summarysummarysummarysummarysummarysummary')

with col3:
   with st.container():
    st.image("img/test_img.png", width=220, use_column_width=100)
    st.write('**[title](%s)**' %url)
    st.write('summarysummarysummarysummarysummarysummary')
