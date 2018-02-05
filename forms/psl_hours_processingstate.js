/**
 * Perform the element right-click action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"5E9569DA-6B37-411F-8E78-10D5C26A48BB"}
 */
function onRightClick$row(event)
{
	var record = foundset.getSelectedRecord();
	
	var menu = plugins.window.createPopupMenu();
	var open_form = menu.addMenuItem('i18n:ma.lbl.open', openJobFromMenu);
		open_form.methodArguments = [record];

	if(foundset.status.status == scopes.psl.Presenze.StatoElaborazione.DA_INVIARE)
	{
		var send_data = menu.addMenuItem('i18n:ma.lbl.send_data', startJobFromMenu);
			send_data.methodArguments = [record];
			send_data.enabled = !globals.ma_utl_hasKey(globals.Key.DEMO);
	}
	
	menu.show(event.getSource());
}

/**
 * @properties={typeid:24,uuid:"861CEA91-6A50-4689-B4FF-77EE50494802"}
 */
function openJobFromMenu(_a, _b, _c, _d, _e, record)
{
	openJob(record);
}

/**
 * @param {JSRecord<db:/ma_framework/psl_hours_processingstate>} record
 *
 * @properties={typeid:24,uuid:"7E5F134B-46C7-4059-B62A-61304B9FCDB6"}
 */
function openJob(record)
{
	try
	{
		if(record)
		{
			forms.psl_nav_main.gotoSection(scopes.psl.Sezioni.PRESENZE);
			forms.psl_nav_presenze.openElaboration(record);
		}
		
		return true;
	}
	catch(ex)
	{
		globals.ma_utl_logError(ex);
		
		forms.psl_nav_main.gotoPreviousSection();
		forms.psl_status_bar.setStatusError(ex.message);
		
		throw ex;
	}
}

/**
 * @properties={typeid:24,uuid:"7FA5691A-0219-46B3-B916-E1F5A24DA86C"}
 */
function startJobFromMenu(_a, _b, _c, _d, _e, record)
{
	var answer = globals.ma_utl_showYesNoQuestion('i18n:ma.psl.msg.start_longrunning_operation');
	if (answer)
		startAssociatedJob(record);
}

/**
 * @param {JSRecord<db:/ma_framework/psl_hours_processingstate>} record
 * 
 * @properties={typeid:24,uuid:"23CCA30F-FF6B-4C03-8412-65B0072B7AA2"}
 */
function startAssociatedJob(record)
{
	var fs = record.psl_hours_processingstate_to_psl_hours_jobqueue;
	if (fs && fs.getSize() > 0)
	{
		forms.psl_nav_main.gotoSection(scopes.psl.Sezioni.PRESENZE);
		return forms.psl_nav_presenze.startJob(fs.getSelectedRecord());
	}
	
	return true;
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"C5EC7D06-FDAF-4608-80AB-9C34A272D25C"}
 */
function onAction$btn_send(event) 
{
	/** @type {Array<JSRecord<db:/ma_framework/psl_hours_processingstate>>}*/
	var elaborations = selectDataToSend();
	if (elaborations && globals.ma_utl_showYesNoQuestion('i18n:ma.psl.msg.start_longrunning_operation'))
		startMultipleJobs(elaborations);
}

/**
 * @param {Array<JSRecord<db:/ma_framework/psl_hours_processingstate>>} records
 * 
 * @properties={typeid:24,uuid:"4CD6066E-0590-44A2-A6EB-1227107C05BB"}
 */
function startMultipleJobs(records)
{
	for(var r = 0; r < records.length; r++)
		startAssociatedJob(records[r]);
}

/**
 * @return {Array<JSRecord<db:/ma_framework/psl_hours_processingstate>>}
 * 
 * @properties={typeid:24,uuid:"F87FFC6C-B71C-4A48-A9A8-3028A9D596C9"}
 */
function selectDataToSend()
{
	/** @type {Array<JSRecord<db:/ma_framework/psl_hours_processingstate>>} */
	var records = globals.ma_utl_showLkpWindow(
			{
				lookup: 'PSL_Lkp_Hours_ProcessingState',
				methodToAddFoundsetFilter: 'filterElaborationsToSend',
				multiSelect: true,
				allowInBrowse: true,
				returnForm: controller.getName(),
				noRecordMessage: 'Nessuna ditta disponibile per l\'invio',
				returnFullRecords: true,
				verbose: true,
				customLookupName: forms.psl_lookup_window.controller.getName(),
				styleName: 'psl',
				dateFormat: globals.MESE_ANNO_DATEFORMAT
			});
	
	return records;
}

/**
 * @properties={typeid:24,uuid:"E0E7CC7B-25CA-4FAE-8EFE-C87B89C0E166"}
 * @AllowToRunInFind
 */
function filterElaborationsToSend(fs)
{
	if(fs)
	{
		var elaborations = globals.foundsetToArray(foundset).filter(function(_){ return _.status.status == scopes.psl.Presenze.StatoElaborazione.DA_INVIARE; })
															.map   (function(_){ return _.elaboration_id; });
		
		fs.addFoundSetFilterParam('elaboration_id', globals.ComparisonOperator.IN, elaborations);
	}
		
	return fs;
}

/**
 * Perform the element right-click action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"CB34511E-067A-4D2F-BA87-A46F2F0E65C8"}
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
 * @properties={typeid:24,uuid:"46A2FB7C-40FB-4883-A95F-6DFA9948BD85"}
 */
function clearFilterFromMenu(_a, _b, _c, _d, _e, event)
{
	clearFilter(event);
}

/**
 * @properties={typeid:24,uuid:"5AF4AE95-64E2-48AD-A24D-3DE1B494651A"}
 */
function clearFilter(event)
{
	foundset.loadAllRecords();
	
	var labels = [elements.lbl_id, elements.lbl_ditta, elements.lbl_periodo, elements.lbl_stato];
	for(var l = 0; l < labels.length; l++)
	{
		/** @type {RuntimeLabel} */
		var label = elements[labels[l].getName()];
			label.imageURL = '';
			label.toolTipText = '';
	}
}

/**
 * @properties={typeid:24,uuid:"1D481CFB-0FDB-480F-AEAE-46E749C14997"}
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
 * @properties={typeid:24,uuid:"1A6A423B-8EFE-4542-B634-6D60DE57D63B"}
 */
function filterData(dataprovider, value)
{
	var searchFunction;
	
	// calculations are not supported in find
	if(solutionModel.getDataSourceNode(foundset.getDataSource()).getCalculation(dataprovider))
	{
		searchFunction = function(fs, dataProviders, values)
		{
			var filteredRecords = globals.foundsetToArray(fs).filter(function(rec)
			{
				for(var dp = 0; dp < dataProviders.length; dp++)
					if(rec[dataProviders[dp]] !== values[dp])
						return false;
				
				return true;
			});
			
			if(!fs || !fs.find())
				throw new Error('i18n:ma.err.findmode');
			
			var pks = databaseManager.getTable(fs.getDataSource()).getRowIdentifierColumnNames();
				pks.forEach(function(pk){ fs[pk] = filteredRecords.map(function(_){ return _[pk]; }); });
			
			fs.search();
		}
	}
	else
	{
		/**
		 * @param {JSFoundset} fs
		 * @param {Array<String>} dataProviders
		 * @param {Array<Array>} values
		 */
		searchFunction = function(fs, dataProviders, values)
		{
			var dup = fs.duplicateFoundSet();
			
			if(!fs || !fs.find())
				throw new Error('i18n:ma.err.findmode');
			
			var ds = solutionModel.getDataSourceNode(fs.getDataSource());
			var hasCalcs = dataProviders.some(function(_dp){ return ds.getCalculation(_dp) !== null; });
			if (hasCalcs)
			{
				var pkeys = databaseManager.getTable(dup).getRowIdentifierColumnNames();
				var recordsToKeep = globals.foundsetToArray(dup)
					.filter(function(_record){ 
						return dataProviders.every(function(_dp, _index){ 
							return values[_index].indexOf(_record[_dp]) > -1;
						});
					})
				
				pkeys.forEach(function(_pk){
					fs[_pk] = recordsToKeep.slice(0).map(function(_record){ return _record[_pk]; });
				});
			}
			else
				for(var dp = 0; dp < dataProviders.length; dp++)
					fs[dataProviders[dp]] = values[dp];
			
			fs.search();
		}
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
			/** @type {Array<String>}*/
			var primaryDataProviders = [], foreignDataProviders = [];
			
			relation.getRelationItems().forEach(function(_){ primaryDataProviders.push(_.primaryDataProviderID); foreignDataProviders.push(_.foreignColumnName); });
			
			var foreignFs = databaseManager.getFoundSet(foreignDataSource);
			if(!foreignFs || !foreignFs.find())
				throw new Error('i18n:ma.err.findmode');
			
			foreignFs[displayedDataProvider] = value;
			foreignFs.search();
			/** @type {Array<Array>}*/
			var foreignValues = foreignDataProviders.map(function(_){ return globals.foundsetToArray(foreignFs, _); });
			
			searchFunction(foundset, primaryDataProviders, foreignValues);
		}
	}
	else
		searchFunction(foundset, [dataprovider], [value]);
}
