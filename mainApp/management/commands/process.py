from django.core.management.base import BaseCommand
from django.utils import timezone
import time
import json
from mainApp.models import Progress
import pandas as pd
from sklearn.preprocessing import LabelBinarizer
 

class Command(BaseCommand):
    help = 'Applies all the ML algorithms one by one and finds out the best one to use'

    def add_arguments(self, parser): 
        # Optional argument
        parser.add_argument('-d', '--data', type=str, help='The json with the csv metadata', )

    def handle(self, *args, **kwargs):
        data = kwargs['data']
        data = json.loads(data) 
        print(data)

        #  Read the dataframe
        df = pd.read_csv("static/uploads/userdata/" + data['filename'])
        print(df)
        for col in df.columns:
            progress = Progress(filename=data["filename"], message=f"{col} is being processed")
            progress.save()
            # can be cat, text, num, skip, label 
            if data[col] == "cat":
                # convert the variable to one hot vectors
                encoder = LabelBinarizer()
                cat = df[col]
                cat_1hot = encoder.fit_transform(cat) 
                pass

            elif data[col] == "text":
                # merge it ()& then remove it)into first text if its not first 
                pass

            elif data[col] == "num":
                pass

            elif data[col] == "skip":
                # remove this attribute from the dataframe
                df = df.drop(col, axis=1) 

            elif data[col] == "label":
                # Mark this as label
                pass
        
        
        
        
        # Prepare the data


        # Try different ML algos and report accuracy
        
        
        # time2 = timezone.now().strftime('%X')
        # for i in range(32):
        #     time.sleep(2)
        #     print(f'{i} done')
        #     message = f"{i} done in 5 seconds"
        #     progress = Progress(filename=data["filename"], message=message)
        #     progress.save()
        # self.stdout.write("It's now %s" % time2)