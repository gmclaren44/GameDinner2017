/*! jQuery UI - v1.12.1 - 2017-06-25
// jQuery Requests for Modal Dialogs
// 
//
// Author: Gina McLaren
// June 25, 2017
//*/

/* JQUERY WIDGET INITIALIZATION - dialogGiftConfirmation */
$( "#dialogGiftConfirmation" ).dialog({
    autoOpen: false,
    title: "2017 Contribution Details",
    dialogClass: "dlgTitle",
    modal: true,
    width: 400,
    buttons: [
        {
            text: "OK",
            click: function() {
                $( this ).dialog( "close" );
                console.log("DIALOG: dialogGiftConfirmation Closed with OK");
                funcUpdateGiftApproved();
            }
        },
        {
            text: "Cancel",
            click: function() {
                $( this ).dialog( "close" );
                console.log("DIALOG: dialogGiftConfirmation Closed with CANCEL");
            }
        }
    ]
});

/* JQUERY WIDGET INITIALIZATION - dialogResetGiftConfirmation */
$( "#dialogResetGiftConfirmation" ).dialog({
    autoOpen: false,
    title: "Reset Contribution Details",
    dialogClass: "dlgTitle",
    modal: true,
    width: 400,
    buttons: [
        {
            text: "OK",
            click: function() {
                $( this ).dialog( "close" );
                console.log("DIALOG: dialogResetGiftConfirmation Closed with OK");
                funcResetGiftApproved();
            }
        },
        {
            text: "Cancel",
            click: function() {
                $( this ).dialog( "close" );
                console.log("DIALOG: dialogResetGiftConfirmation Closed with CANCEL");
            }
        }
    ]
});

/* JQUERY WIDGET INITIALIZATION - dialogLoseConstituentChgs */
$( "#dialogLoseConstituentChgs" ).dialog({
    autoOpen: false,
    title: "SVSEF Donor Information",
    dialogClass: "dlgTitle",
    modal: true,
    width: 400,
    buttons: [
        {
            text: "OK",
            click: function() {
                $( this ).dialog( "close" );
                console.log("DIALOG: dialogLoseConstituentChgs Closed with OK");
                funcSearchConstituentApproved();
            }
        },
        {
            text: "Cancel",
            click: function() {
                $( this ).dialog( "close" );
                console.log("DIALOG: dialogLoseConstituentChgs Closed with CANCEL");
            }
        }
    ]
});

/* JQUERY WIDGET INITIALIZATION - dialogNewSearchChk */
$( "#dialogNewSearchChk" ).dialog({
    autoOpen: false,
    title: "SVSEF Donor Search",
    dialogClass: "dlgTitle",
    modal: true,
    width: 400,
    buttons: [
        {
            text: "OK",
            click: function() {
                $( this ).dialog( "close" );
                console.log("DIALOG: dialogNewSearchChk Closed with OK");
                funcNewSearch();
            }
        },
        {
            text: "Cancel",
            click: function() {
                $( this ).dialog( "close" );
                console.log("DIALOG: dialogNewSearchChk Closed with CANCEL");
            }
        }
    ]
});

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

/* JQUERY WIDGET INITIALIZATION - dialogConstituentConfirmation */
$( "#dialogConstituentConfirmation" ).dialog({
    autoOpen: false,
    title: "Update Donor Information",
    dialogClass: "dlgTitle",
    modal: true,
    width: 400,
    buttons: [
        {
            text: "OK",
            click: function() {
                $( this ).dialog( "close" );
                console.log("DIALOG: dialogConstituentConfirmation Closed with OK");
                funcUpdateConstituentApproved();
            }
        },
        {
            text: "Cancel",
            click: function() {
                $( this ).dialog( "close" );
                console.log("DIALOG: dialogConstituentConfirmation Closed with CANCEL");
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


