/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @copyright Copyright Intermesh
 * @version $Id: TimeEntryDialog.js 21612 2016-08-29 10:12:46Z mschering $
 * @author Merijn Schering <mschering@intermesh.nl>
 */
GO.projects2.TimeEntryDialog = Ext.extend(GO.dialog.TabbedFormDialog , {
	
	// The duration of the standard task in minutes will be saved here after selecting a standard task
	standardTaskDuration: false,

	initComponent : function(){
		
		Ext.apply(this, {
			stateId:'pm-timeentrydialog',
			title:GO.projects2.lang['timeEntry'],
			height: 460,
			width:720,
			formControllerUrl: 'projects2/timeEntry'
		});
		
		GO.projects2.TimeEntryDialog.superclass.initComponent.call(this);	
	},
         
	afterLoad : function(remoteModelId, config, action) {
		if(config.values && this.selectTimeUser.store.baseParams.project_id != config.values.project_id){
			this.selectTimeUser.store.baseParams.project_id = config.values.project_id;
			delete this.selectTimeUser.lastQuery;
		}
		
		
		//this.travelDistanceField.setDisabled(this.selectProject.s)
		
		this.taskField.setProjectId(action.result.project_id);
		
		this.datePicker.setValue(Date.parseDate(action.result.data.start_date, GO.settings.date_format));
		
		this.projectField.store.load();
	},
	
	enableBreak : function(enable) {
		// The xcheckbox returns a '0' or a '1', therefore it needs to be translated to a boolean
		var nextDay = this.timeNextDay.getValue();
		
		this.buttonApply.setDisabled(!nextDay && enable); //with a break the dialog no longer represents 1 entry
		this.startBreakField.setVisible(!nextDay && enable);
		this.startBreakLabel.setVisible(!nextDay && enable);
		this.endBreakField.setVisible(!nextDay && enable);
		this.endBreakLabel.setVisible(!nextDay && enable);
		this.doLayout();
	},
	
	setEndTime : function() {
		if(this.standardTaskDuration!=false) {
			if (this.remoteModelId=="0") {
				var startTime = new Date(this.datePicker.getValue());
				startTime = startTime.add(Date.DAY, this.standardTaskDuration);
				//if(this.endDate.getValue()=="" && this.startTime.getValue()!="")
					this.endDate.setValue(startTime);
			}
		}
	},
	
	durationToEndTime : function() {
		if (!this.durationField.disabled) {
			var durationArray = this.durationField.getValue().split(':');
		} else {
			var durationArray = new Array();
			durationArray.push(0);
			durationArray.push(0);
		}
			
		var startTimeArray = this.startTime.getValue().split(':');
	
		var startDate = Date.parseDate(this.dateField.getValue()+' '+this.startTime.getValue(),GO.settings.date_format+' '+GO.settings.time_format);

		var endTimeDate = startDate.add(
						Date.HOUR,
						Number(durationArray[0])
					).add(
						Date.MINUTE,
						Number(durationArray[1])
					);
		
	
				
		this.endTime.setValue(endTimeDate.format(GO.settings.time_format));

	},
	
	
	timesToDuration : function() {
				
		var startDate = Date.parseDate(this.dateField.getValue()+' '+this.startTime.getValue(),GO.settings.date_format+' '+GO.settings.time_format);
		var endDate = Date.parseDate(this.dateField.getValue()+' '+this.endTime.getValue(),GO.settings.date_format+' '+GO.settings.time_format);
		var totalMins = startDate.getElapsed(endDate) / 60000;
		
		var durationHours = Math.floor(totalMins/60)+""; 
		var durationMins = totalMins - (durationHours*60)+"";
				
		if(durationHours.length==1) {
			durationHours = "0"+durationHours;
		}
		
		if(durationMins.length==1) {
			durationMins = "0"+durationMins;
		}
		this.durationField.setValue(durationHours+':'+durationMins);
		
	},
	
	
	focus: function() {
		return;
//		if(!this.remoteModelId){
//			return GO.projects2.TimeEntryDialog.superclass.focus.call(this);
//		}else
//		{
//			return; // prevent selecting first field so selectOnFocus will work
//		}
	}, 

	buildForm : function(){

		/*
        this.projectField = new Ext.form.Hidden({
			name:'project_id'
		});
		*/
		this.projectField = new GO.projects2.SelectProject({
			anchor:'100%',
//			selectOnFocus: true,
			store:GO.projects2.selectBookableProjectStore,
			listeners:{
				change:function(cmp, newVal){
					this.taskField.setProjectId(newVal);
					var record = GO.projects2.selectBookableProjectStore.getById(newVal);
					
					if(record)
						this.travelDistanceField.setValue(record.data.default_distance);
					
					this.taskField.setValue("");
					
				},
				scope:this
			}
		});
		
		this.taskField = new GO.projects2.SelectTask({
			anchor:'100%'			
		});

		GO.projects2.selectBookableProjectStore.on('load',function(store,records,options){
			if (this.projectField.getValue() > 0) {
				var record = store.getById(this.projectField.getValue());
				if(record) {
					this.taskField.setProjectId(record.data.id);
					var travelDistance = this.travelDistanceField.getValue();
					if (GO.util.empty(travelDistance))
						this.travelDistanceField.setValue(record.data.default_distance);
			}
//				if(this.isNew())
//					this.taskField.setValue("");
//				console.log(record.data);
			}
		},this);
		
		
		this.datePicker = new Ext.DatePicker({
					xtype:'datepicker',
					name:'due_time',
					format: GO.settings.date_format,
					hideLabel:true
				});
				
		this.datePicker.on("select", function(DatePicker, DateObj){
				this.dateField.setValue(DateObj.format(GO.settings.date_format));		
		},this);

		var items =[
		this.projectField,
		this.taskField,
		{
			xtype: 'comboboxreset',
			fieldLabel: GO.projects2.lang['activityType'],
			mode: 'remote',
			emptyText: GO.projects2.lang.activityTypeEmptyText,
			//width: 300,
			anchor:'100%',
			pageSize: parseInt(GO.settings['max_rows_list']),
			triggerAction: 'all',
			hiddenName: 'standard_task_id',
			store: new GO.data.JsonStore({
				url: GO.url('projects2/standardTask/selectstore'),
				fields: ['id', 'label','label_postfix', 'rawunits', 'is_billable'],
				remoteSort: true
			}),
			tpl: new Ext.XTemplate(
				'<tpl for=".">'+
				'<tpl if="!is_billable"><div class="x-combo-list-item">{label} <small style=color:gray;>('+GO.projects2.lang.notBillable+')</small></div></tpl>'+
				'<tpl if="is_billable"><div class="x-combo-list-item">{label}</div></tpl>'+
				'</tpl>'
			),
			listeners: {
				select: function(combo, record, index ){			
					this.standardTaskDuration = Math.round(record.data.rawunits*60);
					this.setEndTime();
				},
				scope: this
			},
			valueField: 'id',
			displayField: 'label'
		},
		{
			layout: 'hbox',
			anchor: '100%',
			border: false,
			items: [{
				items:[	this.datePicker],
				width:250
			},
			this.timePanel = new Ext.Panel({
				layout:'form',
				flex: 1,
				items: [
			
				this.dateField = new Ext.form.Hidden({
					name: 'start_date',					
					allowBlank:false					
				}),
				this.endDate = new Ext.form.DateField({
					name: 'end_date',
					anchor:'100%',
					format: GO.settings['date_format'],
					fieldLabel: GO.timeregistration2.lang['endDate'],
					hidden: true
				}),
				{
					xtype: 'compositefield',
					hideLabel: true,
					items: [
						{
							xtype: 'plainfield',
							value: GO.projects2.lang['startTime']+':',
							width: 100
						},
						this.startTime = new GO.form.TimeField({
							name: 'start_time',
							//format: GO.settings['date_format'],
							allowBlank:false,
							listeners:{
								scope:this,
								change:function(combo, newValue, oldValue){
									this.setEndTime();
									this.timesToDuration();
								},
								select:function(combo, record, index){
									this.setEndTime();
									this.timesToDuration();
								}
							}
						}),
						{
							xtype: 'plainfield',
							value: GO.projects2.lang['duration']+':'
						},
						this.durationField = new GO.form.TimeField({
							format: 'H:i',
							name: 'duration_human',
							listeners:{
								scope:this,
								change:function(numberfield, newValue, oldValue) {
									this.durationToEndTime();
								}
							}
						})
					]
				},
				{
					xtype: 'compositefield',
					fieldLabel: GO.projects2.lang['endTime'],
					items: [
						this.endTime = new GO.form.TimeField({
							name: 'end_time',
							//format: GO.settings['date_format'],
							allowBlank:false,
							listeners: {
								scope: this,
								select:function() {
									this.timesToDuration();
								},
								change:function(combo, newValue, oldValue){
									
									this.timesToDuration();
								}
							}
						}),
						this.timeNextDay = new Ext.ux.form.XCheckbox({
							name: 'end_next_day',
							boxLabel: GO.projects2.lang['timeNextDay'],
							listeners:{
								scope:this,
								check:function(self, checked) {
									this.includeBreak.setDisabled(checked);
									this.durationField.setDisabled(checked);
								}
							}
						})
					]
				},
				this.includeBreakComposite = new Ext.form.CompositeField({
					fieldLabel: GO.projects2.lang['includeBreak'],
					//layout: 'form',
					items: [
					this.includeBreak = new Ext.ux.form.XCheckbox({
						name: 'include_break',
						//xtype: 'xcheckbox',
						listeners:{
							scope:this,
							check:function(self, checked) {
								this.enableBreak(checked);
							}
						}
					}),this.startBreakLabel = new Ext.form.DisplayField({
						value: GO.lang['strStart'],
						hidden: true
					}),this.startBreakField = new GO.form.TimeField({
						name: 'start_break',
						hidden: true
					}),this.endBreakLabel = new Ext.form.DisplayField({
						value: GO.lang['strEnd'],
						hidden: true
					}),this.endBreakField = new GO.form.TimeField({
						//fieldLabel: 'End',
						name: 'end_break',
						hidden: true
					})
					]
				}),
					new Ext.form.TextArea({
						name: 'comments',
						anchor:'100%',
						height:140,
						fieldLabel: GO.lang.strDescription
					}),
					this.travelDistanceField = new GO.form.NumberField({
						xtype:'textfield',
						fieldLabel:GO.projects2.lang.travelDistance,
						name:'travel_distance',
						anchor:'100%',
						decimals: 2
					})
				]
			})
		]
		}
		
		];
		
		/*
		this.selectTimeUser = new GO.projects2.SelectEmployee({
			anchor:'100%'
		});
		if(GO.settings.modules.projects2.permission_level==GO.permissionLevels.manage)
			items.push(this.selectTimeUser);
		*/
		//Add customfields to the time entry dialog on same tab is other fields
		if(GO.customfields){
			var cfFS, formField;
			for(var i=0;i<GO.customfields.types["GO\\Projects2\\Model\\TimeEntry"].panels.length;i++)
			{
				var cfPanel = GO.customfields.types["GO\\Projects2\\Model\\TimeEntry"].panels[i];

				cfFS = {
					layout: 'form',
					columnWidth:.5,
					items:[]
				};
				for(var n=0;n<cfPanel.customfields.length;n++)
				{
					formField = GO.customfields.getFormField(cfPanel.customfields[n]);
					formField.anchor='100%';
					cfFS.items.push(formField);
				}
				items.push(cfFS);
			}
		}
		
		this.formPanel = new Ext.Panel({
			layout:'form',
			cls:'go-form-panel',
			autoScroll:true,
			items:items
		});
		
		this.addPanel(this.formPanel);
		
	}
});
