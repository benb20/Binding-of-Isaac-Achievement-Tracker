from bs4 import BeautifulSoup
import urllib.request
import re
import requests

achArray = []

try:
    html_page = urllib.request.urlopen("https://bindingofisaacrebirth.fandom.com/wiki/Achievements")
    soup = BeautifulSoup(html_page, "html.parser")

    tables = soup.find_all('table', class_='wikitable')
    tables = tables[:-1]
    for tb in tables:
        for row in tb.tbody.find_all('tr'):
            # Find all data for each column
            columns = row.find_all('td')
            if columns != []:
                td = columns[0]
                if td.a:
                    achArray.append(td.a.get('href'))

except requests.exceptions.RequestException as e:
    print(e)

insertArray = [33,37,38,39,40,41,69,83,84,235,339,637]
for i in insertArray:
    achArray.insert(i, "")

achArray.insert(0, "link")

import csv

with open(r'public/CSV/Achievements.csv', 'r') as in_csv, open(r'adj_data.csv', 'w') as out_csv:
    reader = csv.reader(in_csv)
    writer = csv.writer(out_csv)
    for row, new_col in zip(reader, achArray):
        row.append(new_col)
        writer.writerow(row)