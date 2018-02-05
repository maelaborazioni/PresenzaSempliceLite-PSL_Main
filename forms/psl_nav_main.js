/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"1A79B875-5DA3-4BFE-92DE-F3399FE33045"}
 */
var html = '';

/**
 * @properties={typeid:35,uuid:"FE256A18-D154-4BC9-886F-1065CD5AB609",variableType:-4}
 */
var sections = scopes.psl.Sezioni.filterAvailableFor(globals.foundsetToArray(scopes.sec.GetModules(), 'sec_owner_in_module_to_sec_module.name'));

/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"808B1F91-BF84-4A95-B141-7F8EB7AF836C",variableType:-4}
 */
var v_rightpanel_visible = false;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"87B1B755-3CE7-4986-902D-7586BD163BA9"}
 */
var v_section = scopes.psl.Sezioni.HOME['nome'];

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"0A11840C-B6AB-493F-ACD3-FCFA0D6EE181"}
 */
var v_previous_section = scopes.psl.Sezioni.HOME['nome'];

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"2A1AC839-FDF2-4146-950D-B44FF086DBB8"}
 */
function onAction$btn_storico(event) 
{
	showStorico();
}

/**
 * @properties={typeid:24,uuid:"92BF40C0-82F5-42B2-8A3A-B501934895EE"}
 * @AllowToRunInFind
 */
function showStorico()
{
	scopes.log.apriStoricoOperazioniLite();
	
	/** @type {JSFoundset<db:/ma_log/operationlog>}*/
	var fs = databaseManager.getFoundSet(globals.Server.MA_LOG,'operationlog');
	if(fs.find())
	{
		fs.op_ditta = globals.getDitte();
		if(fs.search())
			fs.sort('op_start desc');
	}
	
	var retObj = {status : {op_id : fs.getRecord(1).op_id, 
		                    op_status : 1,
							op_progress : 100}};
	forms.mao_history.checkStatusCallback(retObj);
	forms.mao_history.operationDone(retObj);
//	gotoSection('storico_operazioni');
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"33570A3C-938C-48B2-9126-34EA725D8E34"}
 */
function onAction$btn_quit(event) 
{
	if(!getSection().onQuit(event))
		forms.psl_status_bar.setStatusError('i18n:ma.err.wiz_state_save');
	else
		security.logout(application.getSolutionName());
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"BC8F0956-20EC-4B14-A88D-11EEB563CD70"}
 */
function onAction$menu(event) 
{
	var menu = plugins.window.createPopupMenu();
		menu = buildMenu(menu, sections);
		
	var quit = menu.addMenuItem('Esci', onAction$btn_quit);
		quit.methodArguments = [event];
		
	menu.show(event.getSource());
}

/**
 * @param {plugins.window.Popup} 	  menu
 * @param {Array<scopes.psl.Sezione>} _sections
 *
 * @properties={typeid:24,uuid:"E2641185-442C-4B19-8781-211FF49CB27E"}
 */
function buildMenu(menu, _sections)
{
	_sections.forEach(function(s){
		var item = menu.addMenuItem(s.menu);
			item.setMethod(gotoSectionFromMenu, [s.nome]);
	});
	
	return menu;
}

/**
 * @properties={typeid:24,uuid:"7CBE81D9-DC19-4A4F-90AA-40A022E86DFA"}
 */
function apriGestionePraticheDaMenu()
{
	gotoSection(scopes.psl.Sezioni.ADMIN_PRATICHE);
}

/**
 * @properties={typeid:24,uuid:"C6CE758F-6576-4FF4-8FE0-DEAE7E791EA7"}
 */
function gotoSectionFromMenu(_a, _b, _c, _d, _e, section)
{
	gotoSection(section);	
}

/**
 * @param section
 *
 * @properties={typeid:24,uuid:"DAA42219-549D-4AE1-B4E6-4E4619F5683F"}
 */
function gotoSection(section)
{
	var newSection = section.toString().toLowerCase();
	if (newSection != v_section)
	{
		v_previous_section = v_section;
		elements.section_tab.tabIndex = v_section = newSection;
		
		getCurrentSection().onOpen();
	}
}

/**
 * @properties={typeid:24,uuid:"E62B3AEF-F628-4062-8FFD-9B7F1C554536"}
 */
function gotoPreviousSection()
{
	gotoSection(v_previous_section);
}

/**
 * @properties={typeid:24,uuid:"AB43FB4A-9E74-47DB-ABF4-31DB16ECD5F5"}
 */
function apriPresenze()
{
	if(getCurrentSection().getName() != scopes.psl.Sezioni.PRESENZE)
		gotoSection(scopes.psl.Sezioni.PRESENZE);
}

/**
 * @properties={typeid:24,uuid:"B5C38233-3064-42DD-B5D8-7BD2113B3FEC"}
 */
function getSection()
{
	/** @type {RuntimeForm<psl_nav_wizard>} */
	var form = forms[elements.section_tab.getTabFormNameAt(elements.section_tab.tabIndex)];
	return form;
}

/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"7A2656A7-95B5-4EBC-B803-2939D3E0DCA4"}
 */
function onLoad(event) 
{
	setHtml();
	
	sections.forEach(function(s){
		var me              = controller.getName();
		var sectionFormName = 'psl_nav_' + s.nome;
		/** @type {RuntimeForm<psl_nav_section>} */
		var sectionForm     = forms[sectionFormName];
		
		elements.section_tab.addTab(sectionFormName, s.nome);
		
		sectionForm.registerListener('onprocessing$start', me, function(params)         { controller.enabled = false; });
		sectionForm.registerListener('onprocessing$end'  , me, function(params, success){ controller.enabled = true;  });
		
		forms.psl_forms_processingstate.registerListener(scopes.events.Listeners.ON_DATACHANGE, sectionFormName, sectionForm.onFormStateDataChange)
	});
	
	gotoSection(scopes.psl.Sezioni.HOME);
}

/**
 * @properties={typeid:24,uuid:"8E795F8D-509B-45A3-ABC3-AF1D7ACF02F9"}
 */
function setHtml()
{
//	var btn_id = plugins.WebClientUtils.getElementMarkupId(elements.btn_toggle);
//	var tab_id = plugins.WebClientUtils.getElementMarkupId(elements.job_tab);
//	
//	html = scopes.string.Format(
//			'<script type="text/javascript">\
//				$(document).ready(function() {\
//					$("#@0").click(function(e) { $("#@1").toggle(); } );\
//				});\
//		     </script>', btn_id, tab_id);
}

/**
 * @properties={typeid:24,uuid:"51ED8948-0222-421E-B4C9-B3290F500D41"}
 * 
 * @return {RuntimeForm<psl_nav_section>}
 */
function getCurrentTab()
{
	/** @type {RuntimeForm<psl_nav_section>} */
	var form = forms[elements.section_tab.getTabFormNameAt(elements.section_tab.tabIndex)];
	return form;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"A22FB194-793E-4A70-B1CF-A90899333AAC"}
 */
function onAction$btn_toggle(event)
{
	v_rightpanel_visible = !v_rightpanel_visible;
	setRightPanelVisible(v_rightpanel_visible);		
}

/**
 * @param {Boolean} visible
 *
 * @properties={typeid:24,uuid:"1973D520-0059-4B8B-AC7C-BE34D312ABDF"}
 */
function setRightPanelVisible(visible)
{
	elements.job_tab.visible = visible;
}

/**
 * @return {RuntimeForm<psl_nav_section>}
 * 
 * @properties={typeid:24,uuid:"6900B660-8873-4178-B414-A2E19EBA2830"}
 */
function getCurrentSection()
{
	/** @type {RuntimeForm<psl_nav_section>} */
	var form = forms[elements.section_tab.getTabFormNameAt(elements.section_tab.tabIndex)];
	return form;
}

/**
 * @properties={typeid:24,uuid:"D41C02C2-D40A-4EFB-B1D8-22AB29921603"}
 */
function saveSection()
{
	getCurrentSection().saveState();
}

/**
 * @param sectionIndex
 *
 * @properties={typeid:24,uuid:"D1AF5604-EE98-490D-B8B9-2DF9AB37429B"}
 */
function disableSection(sectionIndex)
{
	elements.section_tab.setTabEnabledAt(sectionIndex, false);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"82712E95-07B2-4326-B709-9CCC8A040900"}
 */
function onAction$btn_home(event) 
{
	gotoSection(scopes.psl.Sezioni.HOME);
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"81082F8B-8803-4043-803C-D84EE5B080CF"}
 */
function onShow(firstShow, event) 
{
	if(firstShow)
       plugins.busy.prepare();
	
}
