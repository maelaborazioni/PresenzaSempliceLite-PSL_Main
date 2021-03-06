encapsulation:44,
items:[
{
height:585,
partType:8,
typeid:19,
uuid:"01484B45-10AC-4141-AC99-83BD6C97D1ED"
},
{
anchors:9,
foreground:"#aaaaaa",
formIndex:7,
location:"310,1",
size:"385,11",
text:"proprietario",
transparent:true,
typeid:7,
uuid:"10ECE990-6078-43B4-ABBF-FB0BAEE14AF0"
},
{
anchors:9,
formIndex:2,
imageMediaID:"25DEBA73-FA19-44B4-879C-89F828373E1A",
location:"10,0",
size:"90,30",
transparent:true,
typeid:7,
uuid:"17371C47-9DD9-4592-A3D7-D7C337955570"
},
{
anchors:3,
dataProviderID:"v_section",
editable:false,
enabled:false,
formIndex:3,
location:"695,1",
name:"menu",
onActionMethodID:"-1",
size:"270,28",
styleClass:"menu",
typeid:4,
uuid:"19002868-ED01-4E6D-83C0-AC02E37E33BC",
valuelistID:"7CD8C15B-9B2A-43DF-A1E0-046D1B9BEB39"
},
{
anchors:11,
formIndex:1,
location:"0,0",
size:"1000,30",
styleClass:"header_bar",
typeid:7,
uuid:"373F0288-5878-4A02-BB1C-E87E02CBC1B1"
},
{
dataProviderID:"html",
displayType:8,
editable:false,
location:"700,0",
size:"10,10",
styleClass:"no_border",
transparent:true,
typeid:4,
uuid:"491067D3-6D5E-4F94-B690-97F3C4F75ECB"
},
{
anchors:7,
borderType:"SpecialMatteBorder,0.0,0.0,0.0,2.0,#000000,#000000,#000000,#cccccc,0.0,",
formIndex:1,
items:[
{
containsFormID:"91A7EE0B-9C76-4815-AF85-AEBB39D48307",
location:"630,60",
relationName:"_to_psl_hours_processingstate$owner_id",
text:"psl_hours_processingstate",
typeid:15,
uuid:"7CC30EB2-8EB2-4539-A074-1EBCCDA16F8C"
},
{
containsFormID:"D47B24D1-4CD4-49DC-BF50-98DD6A9933A0",
location:"646,304",
relationName:"_to_psl_forms_processingstate$owner_id",
text:"psl_form_processingstate",
typeid:15,
uuid:"9CD2AE01-6ED6-451D-9C84-D35E7C2E9A45"
}
],
location:"630,30",
name:"job_tab",
printable:false,
size:"360,535",
styleClass:"split",
tabOrientation:-3,
typeid:16,
uuid:"72AFB8E0-2404-4F86-AC7E-70517CD78CF1",
visible:false
},
{
anchors:9,
dataProviderID:"_to_lgn_owner$owner_id.name",
formIndex:5,
location:"310,12",
name:"lbl_owner",
size:"385,18",
styleClass:"psl_header",
transparent:true,
typeid:7,
uuid:"79611CBC-2E00-4DFF-A5D9-B7ACD06A3B54",
verticalAlignment:0
},
{
anchors:9,
dataProviderID:"scopes.globals.svy_sec_username",
formIndex:6,
location:"110,12",
name:"lbl_username",
size:"200,18",
styleClass:"psl_header",
transparent:true,
typeid:7,
uuid:"83101D32-8C4C-4ACE-A9E4-1535362C5553",
verticalAlignment:0
},
{
anchors:9,
foreground:"#aaaaaa",
formIndex:4,
location:"110,1",
size:"200,11",
text:"username",
transparent:true,
typeid:7,
uuid:"8699E18B-DDA7-41AF-914D-04168A2783DE"
},
{
anchors:15,
location:"0,30",
name:"section_tab",
printable:false,
size:"993,535",
tabOrientation:-1,
transparent:true,
typeid:16,
uuid:"B03270CD-2216-4D88-B530-0D96AF290FE8"
},
{
anchors:7,
formIndex:8,
horizontalAlignment:0,
location:"990,30",
mediaOptions:14,
name:"btn_toggle",
onActionMethodID:"A22FB194-793E-4A70-B1CF-A90899333AAC",
onDoubleClickMethodID:"-1",
onRightClickMethodID:"-1",
rolloverCursor:12,
showClick:false,
size:"10,535",
text:"||",
toolTipText:"Mostra o nasconde il riepilogo delle elaborazioni/pratiche",
typeid:7,
uuid:"BF944F54-45CC-4645-91AD-7561D2A8FEEF",
verticalAlignment:0
},
{
anchors:3,
formIndex:9,
imageMediaID:"2524DEBD-B2B6-488C-BFEC-CAB948889A79",
location:"975,5",
mediaOptions:14,
name:"btn_menu",
onActionMethodID:"BC8F0956-20EC-4B14-A88D-11EEB563CD70",
onDoubleClickMethodID:"-1",
onRightClickMethodID:"-1",
rolloverCursor:12,
showClick:false,
size:"20,20",
toolTipText:"Clicca per aprire il menu",
transparent:true,
typeid:7,
uuid:"C6E68ED0-66D3-4495-8371-8DAF8858AA5E",
verticalAlignment:0
},
{
anchors:14,
formIndex:16,
items:[
{
containsFormID:"0FB81C92-8094-4B30-9BB5-55A2F451274E",
location:"0,590",
text:"psl_status_bar",
typeid:15,
uuid:"F20671AF-B922-4335-AB66-D9981F3B498B"
}
],
location:"0,565",
name:"status_tab",
printable:false,
size:"1000,20",
tabOrientation:-1,
transparent:true,
typeid:16,
uuid:"E0C47431-36AA-4D18-9670-375A31D04D48"
},
{
height:565,
partType:5,
typeid:19,
uuid:"F1542EA7-68E6-4F3E-8007-2BA519CCB6E7"
}
],
name:"psl_nav_main",
navigatorID:"-1",
onLoadMethodID:"7A2656A7-95B5-4EBC-B803-2939D3E0DCA4",
onShowMethodID:"81082F8B-8803-4043-803C-D84EE5B080CF",
scrollbars:4,
showInMenu:true,
size:"1000,570",
styleName:"psl",
typeid:3,
uuid:"D15D79F8-E8B4-4753-966C-22B6FD8B367A"