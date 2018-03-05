from src import app
from flask import request
import re,requests,json

headers = {'Content-Type':'application/json'}
headers_auth={'Content-Type':'application/json',"Authorization": "Bearer 90bfd7ad76d59ae6de19a7427dda0864506ae02d182ca9fc"}

def validemail(email):
    match = re.match('^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$', email)

    if match == None:
        return False
    else:
        return True
        
def validnumber(mobile):
    if len(mobile) == 10:
        return True
    else:
        return False
        
@app.route('/login',methods=['POST'])
def login():
    if request.method=='POST':
        r=json.loads(request.data)   
        print(r['data']['username'])
        
        username=r['data']['username']
        password=r['data']['password']

        if '@' in username:
            data={"provider" : "email",  "data" : {"email": username,"password": password}}
            data=json.dumps(data)
            r = requests.post('https://auth.begun51.hasura-app.io/v1/login', headers=headers, data=data)
            st=r.content
            print(st)
        elif(username.isdigit()):
            data={"provider": "mobile-password", "data": {"mobile": username,"country_code": "91","password": password }}
            data=json.dumps(data)
            r = requests.post('https://auth.begun51.hasura-app.io/v1/login', headers=headers, data=data)
            st=r.content
            print(st)
        else:
            data={"message": "Not a valid entry for username"}
            st=json.dumps(data)
            print(st)
        print(st)
        return st

    
@app.route('/signup',methods=['POST'])
def signup():
    if request.method=='POST':
        r=json.loads(request.data)
        print(r)
        print(r['user']['data']['username'])
        
        username=r['user']['data']['username']
        password=r['user']['data']['password']

        if '@' in username:
            if validemail(username):
                data={"provider" : "email",  "data" : {"email": username,"password": password}}
                data=json.dumps(data)
                r = requests.post('https://auth.begun51.hasura-app.io/v1/signup', headers=headers, data=data)
                st=r.content
                print(st)
            else:
                data={"message": "Not a valid email address" }
                data=json.dumps(data)
                return data
                
        
        elif(username.isdigit()):
            if validnumber(username):
                data={"provider": "mobile-password", "data": {"mobile": username,"country_code": "91","password": password }}
                data=json.dumps(data)
                r = requests.post('https://auth.begun51.hasura-app.io/v1/signup', headers=headers, data=data)
                st=r.content
                print(data)
                print(st)
            else:
                data={"message": "Not a valid mobile number"  }
                st=json.dumps(data)
                print(st)
        else:
            data={"message": "Not a valid entry for username" }
            data=json.dumps(data)
            print(data)
            return data
        return st    


@app.route('/post',methods=['POST'])
def post():
    if request.method=='POST':
        r=json.loads(request.data)
        description=r["description"]
        submission=r["submission"]
        user_id=r["user_id"]

        #file submission
        url = "https://filestore.begun51.hasura-app.io/v1/file"
        headers = {
            "Authorization": bearer
        }

        with open(submission, 'rb') as file_image:
                resp = requests.post(url, data=file_image.read(), headers=headers)

        c=resp.content
        
        #status submission
        requestPayload = {
            "type": "insert",
            "args": {
                "table": "status",
                "objects": [
                    {
                        "description": description
                    }
                ]
            }
        }


        resp = requests.request("POST", url, data=json.dumps(requestPayload), headers=headers_auth)

        print(resp.content)



        ##post submission
        
        requestPayload = {
            "type": "insert",
            "args": {
                "table": "post",
                "objects": [
                    {
                        "hasura_id": user_id,
                        "status_id": status_id,
                        "media_id": c["file_id"]
                    }
                ]
            }
        }


        resp = requests.request("POST", url, data=json.dumps(requestPayload), headers=headers_auth)

        print(json.loads(resp.content))
        return json.loads(resp.content)          
                

        



        r=json.loads(request.data)
        
        url = "https://auth.begun51.hasura-app.io/v1/user/info"
        user_id=r["user_id"]
        resp = requests.request("GET", url, headers=headers)
        if resp.content['user_id']==user_id:
            requestPayload = {
                "type": "select",
                "args": {
                    "table": "post",
                    "columns": [
                        "post_id",
                        "status_id",
                        "media_id"
                    ],
                    "where": {
                        "hasura_id": {
                            "$eq": user_id
                        }
                    }
                }
            }

            resp = requests.request("POST", url, data=json.dumps(requestPayload), headers=headers_auth)
            l={}
            # resp.content contains the json response.
            print(resp.content)
            con=resp.content
            for st in resp.content:

                ##get status of post
                requestPayload = {
                            "type": "select",
                            "args": {
                                "table": "status",
                                "columns": [
                                    "description"
                                ],
                                "where": {
                                    "status_id": {
                                        "$eq": st['status_id']
                                    }
                                }
                            }
                        }
                    
                stat= requests.request("POST", url, data=json.dumps(requestPayload), headers=headers_auth)

                ##get media of post
                url = "https://filestore.begun51.hasura-app.io/v1/file/"+st['file_id']

                file = requests.get(url, stream=TRUE)
                
                l[st['post_id']]=json.dumps({stat.content['description'],file.content})
                print(stat.content)
                
            return json.dumps(l)



@app.route('/logout')
def logout():
    url = "https://auth.begun51.hasura-app.io/v1/user/logout"

    resp = requests.request("POST", url, headers=headers)

    print(resp.content)
    return resp.content
