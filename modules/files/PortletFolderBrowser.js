GO.mainLayout.onReady(function(){
	if(GO.summary)
	{
		GO.summary.portlets['portlet-folder-browser']={
			multiple:true,
			settings:{
				folderId:0,
				folderPath:''
			},
//			folderBrowserTabPanel:folderBrowserTabPanel,
			portletType: 'portlet-folder-browser',
			title: GO.files.lang.folderBrowserPortlet,
			layout:'fit',
			height:200,
			tools: [{
				id: 'gear',
				handler: function(e, target, panel){
					
					if(!this.selectFolderDialog){
						this.selectFolderDialog = new GO.files.SelectFolderDialog({
							value: panel.settings.folderPath,
							handler:function(fs, path, fullResponse){
								panel.settings.folderPath = path;
								panel.settings.folderId = fullResponse.id;
								panel.mainPanel.saveActivePortlets();
								panel.update(path,fullResponse.id);
							}
						});
					}
					
					this.selectFolderDialog.show();
				}
			},{
				id:'close',
				handler: function(e, target, panel){
					panel.removePortlet();
				}
			}],
			
			update:function(path,id){
								
				if(!this.folderBrowserTabPanel){
					this.folderBrowserTabPanel = new GO.files.FolderbrowserTabPanel();
					this.add(this.folderBrowserTabPanel);
				}
				
				// Remove all panels from the tabs
				this.folderBrowserTabPanel.removeAll();
				
				this.setTitle(GO.files.lang.folder +': '+path);
				this.folderBrowserTabPanel.setFolderId(id);
			},
			
			listeners:{
				render:function(){
					this.update(this.settings.folderPath, this.settings.folderId);
				}
			},
			autoHeight:true			
		};
	}
});