//QueryPanel2
Ext.ns('GO.query');

GO.query.QueryPanel = Ext.extend(Ext.Panel , {
	autoScroll: true,
	layout: 'anchor',
	style: {
			overflow: 'auto'
	},

	
	constructor: function (config) {
		if(!config) {
			config = {};
		}
		
		
		config.fieldStore = new GO.data.JsonStore({
				//url: GO.url("core/modelAttributes"),
				url:config.modelAttributesUrl,
				id:'name',
				baseParams:{
					modelName: config.modelName,
					exclude: config.modelExcludeAttributes
				},
				fields: ['name','label','gotype'],
				remoteSort: true,
				autoLoad: true
			});
		var idRecord = new Ext.data.Record({'name':'t.id','label':'ID','gotype':'numberfield'},'id');
		config.fieldStore.on('load',function(){
			config.fieldStore.insert(0,[idRecord]);
		},this);
		
		
		config.criteriaRecord =  Ext.data.Record.create([
		{
			name: 'andor',
			type: 'string'
		},
		{
			name: 'gotype',
			type: 'string'
		},
		{
			name: 'field',
			type: 'string'
		},
		{
			name: 'comparator',
			type: 'string'
		},
		{
			name: 'value',
			type:'string'
		},
		{
			name: 'start_group',
			type:'string'
		}
	]);
		
		
		//add furst criteri item
		config.tbar = [
			new Ext.Button({
				iconCls: 'btn-add',
				text: GO.lang.cmdAdd,
//				text: 'asd'
				cls: 'x-btn-text-icon',
				handler: function(){
					this.newCriteria();
				},
				scope: this
			}),
			config.titleField = new GO.form.PlainField({
				style: 'marginLeft:3px;marginRight:10px;',
				value: '<b>'+GO.lang['strNew']+'</b>'
			}),
			'->',
			new Ext.Button({
				iconCls: 'btn-delete',
				text: GO.lang['cmdReset'],
				cls: 'x-btn-text-icon',
				handler: function(){
					this.reset();
				},
				scope: this
			})
		];
		
		
		config.criteriaStore = new GO.data.JsonStore({
				fields: ['andor','field','comparator', 'value','start_group','gotype','rawValue','rawFieldLabel'],
//				remoteSort: true,
				listeners: {
					scope: this,
					add: function( store, records, options ) {
						
						Ext.each(records, function(record) {
							this.addCriteriaPanel(record);
						}, this);
						
					}
				}
			});
		
		
		GO.query.QueryPanel.superclass.constructor.call(this, config);
		
	},
	
	
	afterRender: function () {
		
		GO.query.QueryPanel.superclass.afterRender.call(this);
		
		
		this.newCriteria();
	},
	
	
	addCriteriaPanel: function(record) {
		
		
		var criteriaPanel = new GO.query.CriteriaFormPanel({
			fieldStore: this.fieldStore,
			trackResetOnLoad: true,
//			record: rec,
			buttons: [
				new Ext.Button({
					iconCls: 'btn-delete',
					text: GO.lang.cmdDelete,
					cls: 'x-btn-text-icon',
					handler: function(){
						
						// remove the criteria form panel
						this.criteriaStore.remove(record);
						this.remove(criteriaPanel);
						this.doLayout();
						
					},
					scope: this
				})
			],
			monitorValid: true,
			listeners: {
				scope: this,
				clientvalidation: function(form, valid) {
					
						var formVal = form.getForm( ).getValues();
					
					
					
					
						
					
					
						
						
					
						record.set('andor', formVal.andor);
						record.set('field', formVal.field);
						record.set('comparator', formVal.comparator);
						record.set('value', formVal.value);
						record.set('start_group', formVal.start_group);
						record.set('gotype', formVal.gotype);
						record.set('rawValue', formVal.rawValue);
						record.set('rawFieldLabel', formVal.rawFieldLabel);
						
						
				}
			}
		});
		
		
		this.add(criteriaPanel);
		
		
		
		
		criteriaPanel.setValues({
			andor: record.get('andor'),
			field: record.get('field'),
			comparator: record.get('comparator'),
			value: record.get('value'),
			start_group: record.get('start_group'),
			gotype: record.get('gotype'),
			rawValue: record.get('rawValue'),
			rawFieldLabel: record.get('rawFieldLabel')
		});
		
		
		this.doLayout();
	},
		
	
	newCriteria: function() {
		
		//insertRow
		var rec = new this.criteriaRecord({
			andor:'AND',
			comparator:'LIKE',
			start_group:false
		});
		var count = this.criteriaStore.getCount();
		this.criteriaStore.insert(count, rec);
		
	},
	
	
	getData : function(dirtyOnly){

		var data = [];
		var record;

		for (var i = 0; i < this.criteriaStore.data.items.length;  i++)
		{
			if(dirtyOnly && !this.criteriaStore.data.items[i].dirty) {
				data.push({id: this.criteriaStore.data.items[i].data.id});
				continue;
			}
			var r = this.criteriaStore.data.items[i].data;
			record={};

			for(var key in r)
			{
				record[key]=r[key];
			}
			data.push(record);
		}

		return data;
	},
	
	clear: function() {
		this.criteriaStore.removeAll();
		this.removeAll();
		this.doLayout();
	},
	
	reset: function() {
		this.clear();
					
		this.newCriteria();
		this.setQueryTitel(GO.lang['strNew'])
	},
	
	setQueryTitel: function (value) {
		this.titleField.setValue('<b>'+ value +'</b>');
	}
	
	
});