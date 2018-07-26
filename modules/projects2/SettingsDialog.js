/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @version $Id: SettingsDialog.js 21429 2016-06-09 09:55:03Z mschering $
 * @copyright Copyright Intermesh
 * @author Merijn Schering <mschering@intermesh.nl>
 */


GO.projects2.SettingsDialog = Ext.extend(GO.dialog.TabbedFormDialog, {
  initComponent: function() {

    Ext.apply(this, {
      goDialogId: 'pm-settings-dialog',
      layout: 'fit',
      title: GO.lang['administration'],
      width: 700,
      height: 500,
      resizable: false,
      formControllerUrl: 'projects2/settings'
    });

    GO.projects2.SettingsDialog.superclass.initComponent.call(this);
  },
  	
  buildForm: function() {

		this.statusesPanel = new GO.projects2.StatusesGrid({
			title:GO.projects2.lang.statuses,
			layout:'fit'
		});
		
		this.typesPanel = new GO.projects2.TypesGrid({
			title:GO.projects2.lang.types,
			layout:'fit'
		});
		
		this.templatesPanel = new GO.projects2.TemplatesGrid({
			title:GO.projects2.lang.templates,
			layout:'fit'
		});

		this.useStatusFilterForSearchChk = new Ext.ux.form.XCheckbox({
			name: 'useStatusFilterSearch',
			fieldLabel: GO.projects2.lang.useStatusFilterSearch,
			labelStyle:'margin:5px'
		});
		
		this.enableFollowNumberChk = new Ext.ux.form.XCheckbox({
			name: 'chkCustomId',
			fieldLabel: GO.projects2.lang.enableFollowNumber,
			labelStyle:'margin:5px'
		});

		this.followNumberFormatField = new Ext.form.TextField({
			name: 'customId',
			fieldLabel: GO.projects2.lang.followNumberFormat,
			labelStyle:'margin:5px'
		});
								
		this.followNumberPanel = new Ext.Panel({
			layout:'form',
			labelWidth:200,
			title: GO.lang.cmdSettings,
			waitMsgTarget:true,
			style:'margin:5px',
			bodyStyle:'padding:5px',
			defaults: {anchor:'100%'},
			items:[
				{
					xtype:'fieldset',
					title:GO.projects2.lang.projectNumbering,
					border:true,
					layout:'form',
					autoHeight:true,
					items:[
						this.enableFollowNumberChk, 
						this.followNumberFormatField
					]
				},
				{
					xtype:'fieldset',
					title:GO.projects2.lang.projectSearch,
					border:true,
					layout:'form',
					autoHeight:true,
					items:[
						this.useStatusFilterForSearchChk
					]
				}
			]
		});

		this.standardTaskGrid = new GO.projects2.StandardTaskGrid();
    
		this.employeesGrid = new GO.projects2.EmployeeGrid();
	
		this.officeTimePanel = new GO.projects2.OfficeTimePanel();
		
	
		this.addPanel(this.followNumberPanel);
		this.addPanel(this.typesPanel);
		this.addPanel(this.officeTimePanel);
		this.addPanel(this.templatesPanel);
		this.addPanel(this.statusesPanel);
		this.addPanel(this.standardTaskGrid);
		this.addPanel(this.employeesGrid);
		
		this.financePermissionsPanel = new GO.grid.PermissionsPanel({
			title: GO.projects2.lang.financePermissions,
			fieldName:'finance_acl',
			hideLevel:true
		});
		
		this.addPermissionsPanel(this.financePermissionsPanel);
	},
	
	afterSubmit : function(action){
		GO.projects2.nameTemplate = action.result.new_name_template;
		GO.projects2.useNameTemplate = action.result.use_name_template;
	}
});
