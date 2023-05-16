<?php 
$datasett = array_filter(scandir('./datasett'), function($item) {
    return !is_dir('/' . $item);
});

foreach($datasett as $i) {
    echo $i, "<br>";
};
?>

