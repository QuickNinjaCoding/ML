import pandas_profiling as pp
import pandas as pd
df = pd.read_csv('static/uploads/userdata/this.csv')
a = pp.ProfileReport(df)

profile = df.profile_report(title='Fidictor Report for "this.csv"')
profile.to_file(output_file="output.html")

print(a)