import sys
import json
import joblib
import traceback
import pandas as pd




movies_dict = joblib.load('model/movie_df.pkl')
similarity = joblib.load('model/similarity.pkl')
movies = pd.DataFrame(movies_dict)
movie_list = movies.title.tolist()

def recommend(movie_title):
    try:
        movie_index = movies[movies['title'] == movie_title].index[0]
    except IndexError:
        return [f"Movie '{movie_title}' not found."]
    distances = similarity[movie_index]
    movie_list = sorted(list(enumerate(distances)), reverse=True, key=lambda x: x[1])[1:6]
    recommended = [movies.iloc[i[0]].title for i in movie_list]
    return recommended



if __name__ == '__main__':
    try:
        # Read input from command line arguments
        input_str = sys.argv[1] if len(sys.argv) > 1 else '{}'
        
        # input_data = json.loads(input_str)
        # input_data = input("Enter movie title to recommend similar movies: ")
        
        # results = 'Inception'
        results = recommend(input_str)
        
        
        print(json.dumps({
            "success": True,
            "recommendations": results,
            "movies_list": movie_list}))
        
    except Exception as e:
        error_trace = traceback.format_exc()
        print(json.dumps({
            "success": False,
            "error": str(e),
            "trace": error_trace
        }))
        sys.exit(1)

