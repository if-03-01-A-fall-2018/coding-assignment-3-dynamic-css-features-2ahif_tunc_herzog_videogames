function playstyleChooser(mode) {
    var script = document.createElement('script');
    script.type = 'text/javascript'; 

    if(mode == 1)
    {
        document.getElementById('AI').style.display = "none";
        document.getElementById('PVP').style.display = "block";
    }
    else if(mode == 0)
    {
        document.getElementById('PVP').style.display = "none";
        document.getElementById('AI').style.display = "block";
    }
}