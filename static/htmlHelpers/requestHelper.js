

function sendRequest(url, body, ok_callback, bad_callback)
{
    return fetch(url,
    {
        method: 'POST',
        body: body,
        headers: { 'Content-Type':'application/json' }
    }).then(response =>
        {
            if(response.ok)
            {
                response.json().then(data => { ok_callback(data); });
            }
            else
            {
                response.json().then(data => { bad_callback(data); });
            }
        }).catch((err)=>{ bad_callback(err); });
}

async function getUserLogin()
{
     const resp = await fetch('/api/getUserLogin',
        {
                method: 'POST',
                headers: { 'Content-Type':'application/json' }
            });

    if(resp.ok)
    {
        return (await resp.json()).login;
    }
    else
    {
        return null;
    }
}

async function getUserId()
{
    const resp = await fetch('/api/getUserId',
        {
            method: 'POST',
            headers: { 'Content-Type':'application/json' }
        });

    if(resp.ok)
    {
        return (await resp.json()).id;
    }
    else
    {
        return null;
    }
}