/*! jQuery UI - v1.12.1 - 2017-06-25
// jQuery Requests for Modal Dialogs
// in the Registration Webform
//
// Author: Gina McLaren
// August 28, 2017
//*/


/* JQUERY WIDGET INITIALIZATION - dialogAlertNoCallback */
$( "#dialogAlertNoCallback" ).dialog({
    autoOpen: false,
    title: "",
    modal: true,
    width: 400,
    buttons: [
        {
            text: "OK",
            click: function() {
                $( this ).dialog( "close" );
                console.log("DIALOG: dialogAlertNoCallback Closed with OK");
            }
        }
    ]
});

/* JQUERY WIDGET INITIALIZATION - dialogInProcess */
$( "#dialogInProcess" ).dialog({
    autoOpen: false,
    closeOnEscape: false,
    modal: true,
    width: 100,
    height: 150,
    dialogClass: "dlgNoTitleNClose"
});


