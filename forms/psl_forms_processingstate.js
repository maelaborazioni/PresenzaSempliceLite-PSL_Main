/**
 * @properties={typeid:35,uuid:"FE7FF95C-320D-401E-9837-045F30511362",variableType:-4}
 */
var v_listeners = { ondatachange: { } };

/**
 * @param {String}   event
 * @param {String}   name
 * @param {Function} func
 *
 * @properties={typeid:24,uuid:"6B46E441-7B0C-4AD6-9F98-291BA914A5D1"}
 */
function registerListener(event, name, func)
{
	if(event && name && func && v_listeners[event] && !v_listeners[event][name])
		v_listeners[event][name] = func;
}

/**
 * @properties={typeid:24,uuid:"C015B3CF-60E9-4C38-BE4A-27358AADFB74"}
 */
function openDossierFromMenu(_a, _b, _c, _d, _e, record)
{
	openDossier(record);
}

/**
 * @param {JSRecord<db:/ma_framework/psl_forms_processingstate>} record
 *
 * @properties={typeid:24,uuid:"A7B4D5E2-3612-4854-B141-CD0F3971073E"}
 */
function openDossier(record)
{
	if(record)
	{
		try
		{
			forms.psl_nav_main.gotoSection(scopes.psl.Sezioni.PRATICHE);
			return forms.psl_nav_pratiche.openPratica(record);
		}
		catch(ex)
		{
			globals.ma_utl_logError(ex);
			scopes.psl.ShowError(ex);
			
			forms.psl_nav_main.gotoPreviousSection();
			
			return false;
		}
	}
	
	return true;
}

/**
 * @properties={typeid:24,uuid:"8945A3A2-22BC-411F-AF8B-634F0DE1A5BF"}
 */
function deleteDossierFromMenu(_a, _b, _c, _d, _e, record)
{
	deleteDossier(record);
}

/**
 * @param record
 *
 * @properties={typeid:24,uuid:"A2060F49-21F1-410E-B887-F20ADFC8E7B1"}
 */
function deleteDossier(record)
{
	if(forms.psl_nav_pratiche_main.isElaborationOpen(record))
		forms.psl_nav_pratiche.gotoMenu();
	
	return forms.psl_nav_pratiche_main.deleteElaboration(record);
}

/**
 * @properties={typeid:24,uuid:"27AC96FC-D11C-4AE3-8737-75D8ABF1E240"}
 */
function deleteAllDossier()
{
	for(var r = 1; r <= foundset.getSize(); r++)
	{
		var record = foundset.getRecord(r);
		if(!record.status || !record.status.status || record.status.status < scopes.psl.Pratiche.StatoElaborazione.IN_ELABORAZIONE)
			foundset.deleteRecord(record);
	}
}

/**
 * Perform the element right-click action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"F660371A-502F-4142-9136-0A4E861A8F12"}
 */
function onRightClick$row(event) 
{
	var menu = plugins.window.createPopupMenu();
	
	var open_dossier = menu.addMenuItem('i18n:ma.lbl.open', openDossierFromMenu);
		open_dossier.methodArguments = [foundset.getSelectedRecord()];
		
	var delete_dossier = menu.addMenuItem('i18n:ma.lbl.delete', deleteDossierFromMenu);
		delete_dossier.methodArguments = [foundset.getSelectedRecord()];
		delete_dossier.enabled = !status || status < scopes.psl.Pratiche.StatoElaborazione.IN_ELABORAZIONE;
		
	if(globals.ma_utl_hasKey(globals.Key.ADMIN_PSL))
	{
		menu.addSeparator();
		
		var admin_menu = menu.addMenu('i18n:ma.lbl.admin');
		var record     = foundset.getSelectedRecord();
		var _status    = record.status;
		
		if(_status)
		{
			var setStatusMenu = admin_menu.addMenu('i18n:ma.psl.lbl.set_status');
			for(var s = _status.status; s <= scopes.psl.Pratiche.StatoElaborazione.ELABORATA; s++)
			{
				var mark_as = setStatusMenu.addMenuItem(scopes.psl.Pratiche.StatoElaborazione.FormatStatus(s), setStatusFromMenu);
					mark_as.methodArguments = [record, s];
			}
			
			/**
			 * Imposta lo stato elaborato solo quando tutti i documenti obbligatori sono stati caricati
			 */
			if(!checkMandatoryUploads(record))
				mark_as.enabled = false;
		}
	}
		
	menu.show(event.getSource());
}

/**
 * Returns true if all mandatory uploads were loaded, false otherwise
 * 
 * @param {JSRecord<db:/ma_framework/psl_forms_processingstate>} record
 * 
 * @AllowToRunInFind
 *
 * @properties={typeid:24,uuid:"F2322108-DDE5-456D-B15E-DF2DF00799B3"}
 */
function checkMandatoryUploads(record)
{
	var fs = record.psl_forms_processingstate_to_psl_forms_uploads.duplicateFoundSet().unrelate();
	if(!fs || !fs.find())
		throw new Error('i18n:ma.err.findmode');
	
	var mandatory_uploads = record.data.moduli.filter(function(m){ return m.mandatory; })
											  .map   (function(m){ return m.id; });
	
	var query = fs.getQuery();
		query.where
			 .add(query.columns.bytes.isNull)
		     .add(query.columns.form_id.isin(mandatory_uploads));
	
	if(!fs.loadRecords(query))
		throw new Error('Error while loading foundset with query [' + query + ']' );
	
	return fs.getSize() == 0;
}

/**
 * @properties={typeid:24,uuid:"9EF3EDB6-10E5-4974-A9BD-4328E6CB0FD1"}
 */
function setStatusFromMenu(_a, _b, _c, _d, _e, _record, _status)
{
	setStatus(_record, _status);
}

/**
 * @param {JSRecord<db:/ma_framework/psl_forms_processingstate>} _record
 * @param _status
 *
 * @properties={typeid:24,uuid:"E94E39B0-FE63-46E0-AC90-AB7A72790175"}
 */
function setStatus(_record, _status)
{
	// JSON fields requires the whole object to be reassigned for properties to be updated
	var currentStatus        = _record.status;
		currentStatus.status = _status;
		
	_record.status = currentStatus;
	
	if(databaseManager.saveData(_record))
	{
		if(forms.psl_nav_pratiche_main.isElaborationOpen(_record))
			forms.psl_nav_pratiche_main.getCurrentTab().restoreProcessingState({ elaboration: _record });
		
		for(var l in v_listeners.ondatachange)
			v_listeners.ondatachange[l](_record.status);
	}
}

/**
 * Perform the element right-click action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"EE7CE0FA-DB6A-4845-A50B-CE05B5BF77C8"}
 * @AllowToRunInFind
 */
function onRightClick$header(event) 
{
	var menu = plugins.window.createPopupMenu();
	
	var labelFor = solutionModel.getForm(controller.getName()).getLabel(event.getElementName()).labelFor;
	if(!labelFor)
		return;
	
	/** @type {RuntimeLabel} */
	var element = elements[labelFor];

	var dataprovider = element.getDataProviderID();
	var tooltipText  = element.toolTipText && element.toolTipText.replace(/%%/g, '');
	var format       = element.format;
	
	if (dataprovider)
	{
		var fs = foundset.duplicateFoundSet();
			fs.sort(function(first, second){ return first[dataprovider] < second[dataprovider] ? -1 : 1; });
			
		var records = globals.foundsetToArray(fs);
		var values  = records.map(function(_){ return _[dataprovider]; });
		
		values.forEach(function(_)
		{
			var firstIndex = values.indexOf(_), lastIndex = values.lastIndexOf(_);
			records.splice(firstIndex + 1, lastIndex - firstIndex);
			values.splice(firstIndex + 1, lastIndex - firstIndex);
		});
		
		records.forEach
		(
			function(_)
			{
				var text;
				
				if(format)
				{
					if(_[dataprovider] instanceof Date)
						text = utils.dateFormat(_[dataprovider], format);
					else
					if(_[dataprovider] instanceof Number)
						text = utils.numberFormat(_[dataprovider], format);
				}
				else
					text = _[dataprovider];
				
				if(tooltipText)
					text += ' (' + (_[tooltipText] || globals.from_i18n(tooltipText)) + ')';
				
				var item = menu.addMenuItem(text, filterDataFromMenu);
					item.methodArguments = [dataprovider, _[dataprovider], event];
			}
		);
	}
	
	menu.addSeparator();
	var clear = menu.addMenuItem(i18n.getI18NMessage('ma.lbl.clear_filter'), clearFilterFromMenu);
		clear.methodArguments = [event];	
	
	menu.show(event.getSource());
}

/**
 * @properties={typeid:24,uuid:"BC55D571-DAFE-4F2A-8F7A-189F45CADDFA"}
 */
function clearFilterFromMenu(_a, _b, _c, _d, _e, event)
{
	clearFilter(event);
}

/**
 * @properties={typeid:24,uuid:"546BDC87-9F16-4564-8D66-FD69DE7B48CA"}
 */
function clearFilter(event)
{
	foundset.loadAllRecords();
	
	var labels = [elements.lbl_id, elements.lbl_descrizione, elements.lbl_stato];
	for(var l = 0; l < labels.length; l++)
	{
		/** @type {RuntimeLabel} */
		var label = elements[labels[l].getName()];
			label.imageURL = '';
			label.toolTipText = '';
	}
}

/**
 * @properties={typeid:24,uuid:"561EBF74-6B37-478F-BF05-AF57FD68BE04"}
 */
function filterDataFromMenu(_a, _b, _c, _d, _e, dataprovider, value, event)
{
	filterData(dataprovider, value);
	/** @type {RuntimeLabel} */
	var label = elements[event.getElementName()];
		label.imageURL = 'media:///filter_40.png';
		label.toolTipText = 'Filtro abilitato';
}

/**
 * @AllowToRunInFind
 * 
 * @param {String} dataprovider
 * @param value
 *
 * @properties={typeid:24,uuid:"375D4736-6AF5-4E45-9C2A-6A46A5211A76"}
 */
function filterData(dataprovider, value)
{
	var searchFunction = function(fs, dataProviders, values)
	{
		var filteredRecords = globals.foundsetToArray(fs).filter(function(rec)
		{
			for(var dp = 0; dp < dataProviders.length; dp++)
				if(values[dp].indexOf(rec[dataProviders[dp]]) == -1)
					return false;
			
			return true;
		});
		
		if(!fs || !fs.find())
			throw new Error('i18n:ma.err.findmode');
		
		var pks = databaseManager.getTable(fs.getDataSource()).getRowIdentifierColumnNames();
			pks.forEach(function(pk){ fs[pk] = filteredRecords.map(function(_){ return _[pk]; }); });
		
		fs.search();
	}
	
	var split = dataprovider.split('.');
	if (split.length > 1)
	{
		var relation = solutionModel.getRelation(split[0]);

		var primaryDataSource = relation.primaryDataSource;
		var foreignDataSource = relation.foreignDataSource;
		
		// if the relation is defined on the same database the find should work fine
		if(databaseManager.getDataSourceServerName(primaryDataSource) !== databaseManager.getDataSourceServerName(foreignDataSource))
		{	
			var displayedDataProvider  = split[split.length - 1];
			var primaryDataProviders = [], foreignDataProviders = [];
			
			relation.getRelationItems().forEach(function(_){ primaryDataProviders.push(_.primaryDataProviderID); foreignDataProviders.push(_.foreignColumnName); });
			
			var foreignFs = databaseManager.getFoundSet(foreignDataSource);
			if(!foreignFs || !foreignFs.find())
				throw new Error('i18n:ma.err.findmode');
			
			foreignFs[displayedDataProvider] = value;
			foreignFs.search();
			
			var foreignValues = foreignDataProviders.map(function(_){ return globals.foundsetToArray(foreignFs, _); });
			
			searchFunction(foundset, primaryDataProviders, foreignValues);
		}
	}
	else
		searchFunction(foundset, [dataprovider], [value]);
}
