# api
Restfull API

```js
function GetResponse(result){
    document.getElementById("formsignup").innerHTML = result;
}

let datajson = {
    "namadepan": namadepan,
    "namabelakang": namabelakang,
    "email": email,
    "password": password
    }

postJSON("https://foo.bar","Token","dsf9ygf87h98u479y98dj0fs89nfd7",datajson,GetResponse);

```

Alamat CDN:  
https://cdn.jsdelivr.net/gh/jscroot/api/  

## Release

Tag version
```sh
git tag                                 	#check current version
git tag v0.0.8                          	#set tag version
git push origin --tags  
```