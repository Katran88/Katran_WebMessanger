function sendRequest(method, url, body, ok_callback, bad_callback)
{
    return fetch(url,
    {
        method: method,
        body: body,
        headers: { 'Content-Type':'application/json' }
    }).then(response =>
        {
            if(response.ok)
            {
                response.json().then(data =>
                {
                    ok_callback(data);
                });
            }
            else
            {
                response.json().then(data =>
                {
                    bad_callback(data);
                });
            }
        }).catch((err)=>{ bad_callback(err); });
}