let currentTabId = undefined;

function changeTab(newTabId)
{

    if(currentTabId != undefined)
    {
        document.getElementById(currentTabId).style.display = 'none';
        document.getElementById('i_' + currentTabId).style.color = 'var(--dark-grey-color)';
    }

    document.getElementById(newTabId).style.display = 'inline-block';
    document.getElementById('i_' + newTabId).style.color = 'var(--blue-color)';
    currentTabId = newTabId;
}