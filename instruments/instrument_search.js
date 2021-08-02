$(document).ready(function(){

    $(".select-all").click(function(){
        let set = $(this).attr("name");
        $("." + set + ":checkbox").prop("checked",true);
    });

    $(".deselect-all").click(function(){
        let set = $(this).attr("name");
        $("." + set + ":checkbox").prop("checked",false);
    });

    $("#get-list").click(function(){
        let selected_chargetimes = get_checked_boxes('chargetime');
        let selected_ranges = get_checked_boxes('range');
        let selected_firetypes = get_checked_boxes('firetype');
        let selected_cointypes = get_checked_boxes('cointype');
        let selected_elements = get_checked_boxes('element');
        let selected_instruments = get_checked_boxes('instrument');

        // make a list of valid coins
        let coins_list = [];
        selected_elements.forEach(function(element){
            selected_cointypes.forEach(function(coin){
                coins_list.push(element + " " + coin);
            });
        });

        //make a list of valid ranges
        let range_list = [];
        selected_ranges.forEach(function(range){
            selected_firetypes.forEach(function(firetype){
                range_list.push(range + " " + firetype);
            });
        });

        let filtered_spells = spell_list.filter(record => range_list.includes(record["range"])).filter(record => selected_chargetimes.includes(record["chargetime"]));

        let instruments = [];
        selected_instruments.forEach(function(type){
            instrument_list[type].forEach(function(material){
                coins_list.forEach(function(coin){
                    filtered_spells.forEach(function(spell){
                        if (material[coin] === spell["name"]) {
                            let split_coin = coin.split(" ");
                            let instrument_recipe = {
                                "Instrument Type": type,
                                "Element": split_coin[0],
                                "Coin": split_coin[1],
                                "Material": material["Material"],
                                "Damage": material[split_coin[1]],
                                "Spell Name": spell["name"],
                                "Range": spell["range"],
                                "Charge Time": spell["chargetime"],
                                "Additional Effects": spell["effect"]
                            };
                            instruments.push(instrument_recipe);
                        }
                    });
                });
            });
        });

        instruments.sort(dynamicSort("-Damage"));
        $("#result").html(generateTable(instruments));

    });
});

function get_checked_boxes(classname) {
    let a = [];
    $("." + classname + ":checkbox:checked").each(function() {
        a.push(this.value);
    });
    return a;
}

function dynamicSort(property) {
    let sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        let result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

function generateTable(objects) {
    let keys = Object.keys(objects[0]);
    let table_body = '<table><thead><tr>';
    keys.forEach(function(key){
        table_body += '<th>' + key + '</th>';
    });
    table_body += '</tr></thead><tbody>';
    objects.forEach(function(object){
        table_body += '<tr>';
        keys.forEach(function(key){
            table_body +='<td>';
            table_body +=object[key];
            table_body +='</td>';
        });
        table_body+='</tr>';
    });
    table_body+='</tbody></table>';
    return table_body;
}