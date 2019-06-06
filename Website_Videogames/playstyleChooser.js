document.querySelector("#PVP-button").addEventListener("click", function() 
{
    playstyleChooser(1);
});

document.querySelector("#AI-button").addEventListener("click", function() 
{
    playstyleChooser(0);
});

function playstyleChooser(mode) {
    if(mode == 1)
    {
        document.getElementById('AI').style.display = "none";
        document.getElementById('PVP').style.display = "block";
    }
    else if(mode === 0)
    {
        document.getElementById('PVP').style.display = "none";
        document.getElementById('AI').style.display = "block";
    }
}