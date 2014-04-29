var perBow,
    activeItem,
    showed = true,
    orderChart = 0,
    clickIndex = 0,
    orderItems = [],
    buttonfn = 'add',
    newOrderNumber = 0;
    

var $name = $('#name'),
    $soup = $('#soup'),
    $cross = $('#cross'),
    $noodle = $('#noodles'),
    $takeAway = $('#takeAway'),
    $orderList = $('#orderList'),
    $printArea = $('#orderList'),
    $content = $('#contentInfo'),
    $orderItemsHolder = $('#orderName');


var soupType = {"miso": 1,"shoyu": 1, "": 1},
    noodleType = {"large": 1, "medium": 1, "small": 1, "": 1};


var RamenSelection = function( orderNames , soupType , noodleSize , takeAway ){

    var _soupSelect = soupType || 'Miso',
        _noodleSelect = noodleSize || 'Medium',
        _takeAway = _takeAwayFn(),
        _orderNumber = _orderChartCounter(),
        _nameSelect = orderNames || 'Number ' + newOrderNumber,
        _objectSelect = orderItems.length;

    function _orderChartCounter(){
        if( buttonfn == 'add' ){
            if( orderChart < 10 ){
            newOrderNumber = '0'+ orderChart++;
            }else{
                newOrderNumber = orderChart++;
            }
            return newOrderNumber;
        }
    };

    function _takeAwayFn(){
        var takeAway = $takeAway.val();
        if( takeAway == 'Take Away' ){
            perBow.showOrderName( 'Please Consume the Ramen as soon as possible' );
        }
        return takeAway;
    };

    this.getData = function (attr) {
        switch (attr) {
            case 'name':
                return _nameSelect;
                break;
            case 'soup':
                return _soupSelect;
                break;
            case 'noodle':
                return _noodleSelect;
                break;
            case 'takeAway':
                return _takeAway;
                break;
            case 'orderNumber':
                return _orderNumber;
                break;
            case 'objectSelect':
                return _objectSelect;
                break;
        }
    };

    this.showOrderName = function( message ){

        if(message){
            $orderItemsHolder.empty().append( message );
        }
        else{
            $orderItemsHolder.empty().append( 'Order by ' + orderItems[clickIndex].getData('name') );
        }

        if( showed ){
            showed = false;
            $orderItemsHolder.stop(true, true).animate({  marginLeft : '0px' }, function(){
                setTimeout( function(){ 
                    showed = true;
                    $orderItemsHolder.stop(true, true).animate({ marginLeft : '300px' }); }, 5000);
                });
        }
    };

    this.editForm = function(){
        activeItem = orderItems[clickIndex];
        $name.val( activeItem.getData('name') );
        $soup.val( activeItem.getData('soup') );
        $noodle.val( activeItem.getData('noodle') );
        $takeAway.val(activeItem.getData('takeAway'));
        changeButtonFn();
    };

    this.submitEdit = function(){
        _soupSelect = $soup.val();
        _noodleSelect = $noodle.val();
        _takeAway = $takeAway.val();
        _nameSelect = $name.val();
        changeButtonFn();
    };

};

RamenSelection.prototype.deleteRequest = function(){
    orderItems.splice(clickIndex,1);
    clearForm();
    printDOM();
};

function printDOM(){
    var totalListDOMElement ='',
        orderItemsLength = orderItems.length;

    for (var i = 0; i < orderItemsLength; i++ ){
        var DOMObject = '<li class="order flip"><div class="lightbox"><div class="edit" id="whoContent">Who Order ?</div><div class="edit" id="editContent">Edit Order</div><div class="edit" id="removeContent">Remove Order</div></div><p class="orderNum">Order '+ orderItems[i].getData('orderNumber') +'</p><p>Soup Type : <strong>'+ orderItems[i].getData('soup') +' </strong></p><p>Noodle Size : <strong>'+ orderItems[i].getData('noodle') +'</strong></p><p class="orderTakeAway">'+ orderItems[i].getData('takeAway') +'</p></li>';
        totalListDOMElement += DOMObject
    };

    localStorage.setItem('JSON', orderItems );
    localStorage.setItem('currentData',  totalListDOMElement);

    $content.fadeOut(1000, function(){
        $printArea.empty().append( localStorage.getItem('currentData') );
    });
};

var changeButtonFn = function(){
    if( buttonfn == 'edit'){
        buttonfn = 'add';
        $cross.hide();
    }else{
        buttonfn = 'edit';
        $cross.show();
    }
}

var clearForm = function(){
        $name.val('');
        $soup.val('');
        $noodle.val('');
        $takeAway.val('Having Here');
};

function findIndex(ele){
    clickIndex = $(ele).parents('li').index();
}

// function populateDataOnLoad(){
//     if( localStorage.getItem('currentData')){
//         orderItems = localStorage.getItem("JSON");
//         console.log('loading');
//         totalListDOMElement = localStorage.getItem('currentData');
//         orderChart = orderItems.length;
//         perBow = new RamenSelection();
//         printDOM();
//     }
// };
// populateDataOnLoad();

function validationOrder(){

    var soupCheck = $soup.val(),
        noodleCheck = $noodle.val(),
        nameVal = $name.val(), 
        takeAwayVal = $takeAway.val(),
        wrong = '';

    if( !soupType[soupCheck.toLowerCase()] && !noodleType[noodleCheck.toLowerCase()]){
        wrong = 'Your request soup type "'+ soupCheck +'" and noodle size "'+ noodleCheck +'""is not correct, please check your order';
        perBow.showOrderName( wrong );
    }
    else if( !soupType[soupCheck.toLowerCase()] && noodleType[noodleCheck.toLowerCase()]){
        wrong = 'Your request soup type "'+ soupCheck +'" is not correct, please check your order' ;
        perBow.showOrderName(  wrong );
        
    }
    else if( soupType[soupCheck.toLowerCase()] && !noodleType[noodleCheck.toLowerCase()]){
        wrong = 'Your request noodle size "'+ noodleCheck +'" is not correct, please check your order';
        perBow.showOrderName( wrong );
    }
    else{

        if( buttonfn == 'add'){
            perBow = new RamenSelection( nameVal , soupCheck, noodleCheck, takeAwayVal );
            orderItems.unshift(perBow);
            printDOM();
        }else{
            orderItems[clickIndex].submitEdit();
            var message = 'Order Number '+ orderItems[clickIndex].getData('orderNumber')+' has been edited';
            perBow.showOrderName( message );
            clearForm();
            printDOM();
        }
    }
}

// -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
// -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-

//                              CLICK FUNCTION

// -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
// -_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-


$("#button").click(function() {
    validationOrder();
});

$("#cross").click(function() {
    var edditingContent = orderItems[clickIndex];
    changeButtonFn();
    clearForm();
});

$orderList.on('click', '#whoContent',  function() {
    findIndex(this);
    perBow.showOrderName();
    changeButtonFn();
    clearForm();
});

$orderList.on('click', '#editContent',  function() {
    findIndex(this);
    perBow.editForm();
});

$orderList.on('click', '#removeContent',  function() {
    findIndex(this);
    perBow.deleteRequest();
    changeButtonFn();
    clearForm();
});



