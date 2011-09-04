
Ext.setup({
    onReady:function(){
    	
    	
    	// -------------(function) main calculation for each year---------------
	window.generateData = function(loan_amount,loan_term,interest_rate,frequency,rtype){
		var period=0; var power=0; var term_interest=0; var payment=0;var data=[];
		if (frequency=="1"){
			period=52;
		}
		if (frequency=="2"){
			period=26;
		}
		if (frequency=="3"){
			period=12;
		}
		
		power=loan_term*period;
		term_interest=interest_rate/(period*100);
		payment=loan_amount*term_interest*Math.pow((1+term_interest),power)/(Math.pow((1+term_interest),power)-1);
		
		var total_repayment = payment*loan_term*period;
		var interest_only_payment=1*loan_amount*term_interest;
		var interest_only_total_repayment=1*loan_amount+1*interest_only_payment*period*loan_term;
		
		for (var i=0;i<=power;i++){
			if (i%period==0){		
				var year_term = i/period;
				if (rtype=='1'){
					var result_including_interest = Math.round(total_repayment-year_term*payment*period);
					var a1 = Math.pow((1+term_interest),i)*loan_amount;
					var a2 = Math.pow((1+term_interest),i)-1;
					var a3 = a2*payment/term_interest;
					var a4 = a1-a3;
					var result_home_loan=Math.round(a4);
				}
				else if (rtype=='2'){
					var result_home_loan = 1*loan_amount;
					var result_including_interest = Math.round(interest_only_total_repayment-year_term*interest_only_payment*period);
					}
				var exact_year = i/period;
				data.push({
					name: exact_year,
					Home_Loan: result_home_loan,
					Including_Interest: result_including_interest
				});
			}
		}
		return data;
	};
	// --------------end (function) main calculation for each year----------------
    	
	// --------------(function) calculate payment-----------------
	window.generateResult = function(loan_amount,loan_term,interest_rate,frequency,rtype){
		var period=0; var power=0; var term_interest=0; var payment=0;var data1=[];
		if (frequency=="1"){
			period=52;
			period_frequency = "weekly";
		}
		if (frequency=="2"){
			period=26;
			period_frequency = "fornightly";
		}
		if (frequency=="3"){
			period=12;
			period_frequency = "monthly";
		}
		
		power=loan_term*period;
		term_interest=interest_rate/(period*100);
		payment=loan_amount*term_interest*Math.pow((1+term_interest),power)/(Math.pow((1+term_interest),power)-1);
		
		var total_repayment = payment*loan_term*period;
		
		payment = Math.round(payment*100)/100;
		total_repayment = Math.round(total_repayment*100)/100;
		data1.push({
			period: period_frequency,
			period_payment: payment,
			total_payment: total_repayment
		});
		return data1;
	};
	// --------------end (function) calculate payment-----------------
		
	// --------------(function) initial data for graph------------
    	window.store1 = new Ext.data.JsonStore({
    		fields: ['name','Home_Loan','Including_Interest'],
    		data: generateData(600000,30,7,1,1)
    	});
	//---------------end (function) initial data for graph
    	
	// --------------(function) initial data for result------------
    	window.result1 = new Ext.data.JsonStore({
    		fields: ['period_payment', 'total_payment'],
    		data: generateResult(600000,30,7,1,1)
    	});
	// --------------end (function) initial data for result------------
    	
	// --------------(function) help button------------
    	var onHelpTap = function() {
		new Ext.Panel({
 		        floating: true,
		        modal: true,
		        centered: true,
		        width: 300,
		        height: 250,
		        styleHtmlContent: true,
		        scroll: 'vertical',
		        dockedItems: [{
		        	dock: 'top',
		        	xtype: 'toolbar',
		                title: 'Help'
		        }],
		        stopMaskTapEvent: false,
		        fullscreen: false,
			html: "Swipe the screen to select different calculator."
		}).show('pop');
	};
	// --------------end (function) help button------------
    	
	//---------------(layout) enter data for normal repayment-------------
	var normalRepayment = new Ext.chart.Panel({
		title: 'Normal Repayment Calculator',
		layout: 'fit',
	        dockedItems: [{
	        	xtype: 'button',
	        	iconCls: 'help',
 	                iconMask: true,
                	ui: 'plain',
	        	handler: onHelpTap
	        }],
		items: [{
			title: 'Input',
			xtype: 'form',
			id: 'basicform',
			name: 'myForm',
			store: result1,
			scroll: 'vertical',
			items: [{
				xtype: 'fieldset',
				title: 'Please input your detail',
				defaults: {
					labelWidth: '35%'
				},
				items: [{
					xtype: 'numberfield',
					name: 'loan_amount',
					id: 'loan_amount',
					label: 'Loan amount ($)',
					required: true,
					useClearIcon: true,
					value: 600000,
					listeners: {
						blur: function(){
							onRefresh();
							onSummary(result1);
						}
					}
				},{
					xtype: 'numberfield',
					name: 'loan_term',
					id:'loan_term',
					label: 'Mortgage term (year)',
					required: true,
					useClearIcon: true,
					minValue: 0,
					maxValue: 40,
					value: 30,
					listeners: {
						blur: function(){
							var loan_term = new Ext.getCmp('loan_term').getValue();
							Ext.getCmp('term_slider').setValue(loan_term);
							onRefresh();
							onSummary(result1);
						}
					}
				},{
					xtype: 'sliderfield',
					id: 'term_slider',
					label: ' ',
					minValue: 0,
					maxValue: 40,
					value: 30,
					listeners: {
						change: function(){
							var term_slider = new Ext.getCmp('term_slider').getValue();
							Ext.getCmp('loan_term').setValue(term_slider);
							onRefresh();
							onSummary(result1);
						}
					}
				},{
					xtype: 'numberfield',
					name: 'interest_rate',
					id: 'interest_rate',
					label: 'Interest rate (%)',
					required: true,
					useClearIcon: true,
					stepValue: '0.01',
					minValue: 2,
					maxValue: 8,
					value: 7,
					listeners: {
						blur: function(){
							var interest_rate = new Ext.getCmp('interest_rate').getValue();
							Ext.getCmp('interest_slider').setValue(interest_rate);
							onRefresh();
							onSummary(result1);
						}
					}
				},{
					xtype: 'sliderfield',
					id: 'interest_slider',
					label: ' ',
					increment: 0.01,
					minValue: 2,
					maxValue: 8,
					value: 7,
					listeners: {
						change: function(){
							var interest_slider = new Ext.getCmp('interest_slider').getValue();
							Ext.getCmp('interest_rate').setValue(interest_slider);
							onRefresh();
							onSummary(result1);
						}
					}
				},{
					xtype: 'selectfield',
					name: 'frequency',
					id: 'frequency',
					label: 'Repayment frequency',
					value: '1',
					options: [
						{text: 'Weekly', value: '1'},
						{text: 'Fornightly', value: '2'},
						{text: 'Monthly', value: '3'}
					],
					listeners: {
						change: function(){
							onRefresh();
							onSummary(result1);
						}
					}
				},{
					xtype: 'selectfield',
					name: 'rtype',
					id:'rtype',
					label: 'Repayment type',
					value: '1',
					options: [
						{text: 'Principal & Interest', value: '1'},
						{text: 'Interest Only', value: '2'}
					],
					listeners: {
						change: function(){
							onRefresh();
							onSummary(result1);
						}
					}
				}]
			}]
		}]
	});
	//---------------end (layout) enter data for normal repayment-------------
	
	//---------------(layout) enter data for extra repayment-------------
	var extraRepayment = new Ext.chart.Panel({
		title: 'Extra Repayment Calculator',
		layout: 'fit',
		store: store1,
	        dockedItems: [{
	        	xtype: 'button',
	        	iconCls: 'help',
        	        iconMask: true,
        	        ui: 'plain',
	        	handler: onHelpTap
	        }],
		items: [{
			xtype: 'form',
			id: 'extra_form',
			name: 'extra_form',
			scroll: 'vertical',
			items: [{
				xtype: 'fieldset',
				title: 'Please input your detail',
				defaults: {
					labelWidth: '35%'
				},
				items: [{
					xtype: 'numberfield',
					name: 'extra_loan_amount',
					id: 'extra_loan_amount',
					label: 'Loan amount ($)',
					required: true,
					useClearIcon: true,
					value: 600000,
					listeners: {
						blur: function(){
							onTest(store1);
						}
					}
				},{
					xtype: 'numberfield',
					name: 'extra_loan_term',
					id:'extra_loan_term',
					label: 'Mortgage term (year)',
					required: true,
					useClearIcon: true,
					minValue: 0,
					maxValue: 40,
					value: 30,
					listeners: {
						blur: function(){
							var extra_loan_term = new Ext.getCmp('extra_loan_term').getValue();
							Ext.getCmp('extra_term_slider').setValue(extra_loan_term);
							//onTest(store1);
						}
					}
				},{
					xtype: 'sliderfield',
					id: 'extra_term_slider',
					label: ' ',
					minValue: 0,
					maxValue: 40,
					value: 30,
					listeners: {
						change: function(){
							var extra_term_slider = new Ext.getCmp('extra_term_slider').getValue();
							Ext.getCmp('extra_loan_term').setValue(extra_term_slider);
							//onTest(store1);
						}
					}
				},{
					xtype: 'numberfield',
					name: 'extra_interest_rate',
					id: 'extra_interest_rate',
					label: 'Interest rate (%)',
					required: true,
					useClearIcon: true,
					stepValue: '0.01',
					minValue: 2,
					maxValue: 8,
					value: 7,
					listeners: {
						blur: function(){
							var extra_interest_rate = new Ext.getCmp('extra_interest_rate').getValue();
							Ext.getCmp('extra_interest_slider').setValue(extra_loan_term);
							//onTest(store1);
						}
					}
				},{
					xtype: 'sliderfield',
					id: 'extra_interest_slider',
					label: ' ',
					increment: 0.01,
					minValue: 2,
					maxValue: 8,
					value: 7,
					listeners: {
						change: function(){
							var extra_interest_slider = new Ext.getCmp('extra_interest_slider').getValue();
							Ext.getCmp('extra_interest_rate').setValue(extra_interest_slider);
							//onTest(store1);
						}
					}
				},{
					xtype: 'numberfield',
					name: 'extra_repayment',
					id: 'extra_repayment',
					label: 'Extra Repayment($)',
					value: '500',
					minValue: 0,
					maxValue: 2000,
					stepValue: '20',
					useClearIcon: true,
					listeners: {
						blur: function(){
							var extra_repayment = new Ext.getCmp('extra_repayment').getValue();
							Ext.getCmp('extra_slider').setValue(extra_repayment);
							//onTest(store1);
						}
					}
				},{
					xtype: 'sliderfield',
					name: 'extra_slider',
					id: 'extra_slider',
					label: ' ',
					increment: 10,
					minValue: 0,
					maxValue: 2000,
					value: 500,
					listeners: {
						change: function(){
							var extra_slider = new Ext.getCmp('extra_slider').getValue();
							Ext.getCmp('extra_repayment').setValue(extra_slider);
							//onTest(store1);
						}
					}
				},{
					xtype: 'selectfield',
					name: 'extra_frequency',
					id: 'extra_frequency',
					label: 'Repayment frequency',
					value: '1',
					options: [
						{text: 'Weekly', value: '1'},
						{text: 'Fornightly', value: '2'},
						{text: 'Monthly', value: '3'}
					],
					listeners: {
						change: function(){
							//onTest(store1);
						}
					}
				},{
					xtype: 'selectfield',
					name: 'extra_rtype',
					id:'extra_rtype',
					label: 'Repayment type',
					value: '1',
					options: [
						{text: 'Principal & Interest', value: '1'},
						{text: 'Interest Only', value: '2'}
					],
					listeners: {
						change: function(){
							//onTest(store1);
						}
					}
				}]
			}]
		}]
	});
	//---------------end (layout) enter data for extra repayment-------------
	
	//---------------(function) update content on summary panel-------------
	var onSummary = function(data1){
		var summary_panel = new Ext.getCmp('summary');
		var length = data1.data.length;
		var address = data1.data.getAt(0).data;
		var sumTable = "<table class = 'summary_table'>";
		sumTable += "<tr><td>Your "+ address.period +" payment</td><td>"+address.period_payment+"</td></tr>";
		sumTable += "<tr><td>Your total repayment</td><td>"+ address.total_payment+"</td></tr></table>";
		summary_panel.update(sumTable);
	};
	//---------------end (function) update content on summary panel-------------
	
	//---------------(function) test for loading data (will modify soon)-------------
	var onTest = function(data1){
		console.log(data1);
		var summary_panel = new Ext.getCmp('summary');
		var length = data1.data.length;
		var value = data1.data.getAt(0).data.Home_Loan;
		console.log(value);
		var listTable = '<table>';
		for (var i = 0;i<length;i++){
			
			var address = data1.data.getAt(i).data;
			listTable += '<tr><td>'+address.Home_Loan+'</td><td>'+address.Including_Interest+'</td></tr>';
		}
		listTable += '</table>';
		summary_panel.update(listTable);
	};
	//---------------test (function) for loading data-------------
    	
	//---------------(function) update graph and summary-------------
    	var onRefresh = function() {
    		var loan_amount = new Ext.getCmp('loan_amount').getValue();
			var loan_term = new Ext.getCmp('loan_term').getValue();
			var interest_rate = new Ext.getCmp('interest_rate').getValue();
			var frequency = new Ext.getCmp('frequency').getValue();
			var rtype = new Ext.getCmp('rtype').getValue();
		
    		window.store1.loadData(generateData(loan_amount,loan_term,interest_rate,frequency,rtype));
        	window.result1.loadData(generateResult(loan_amount,loan_term,interest_rate,frequency,rtype));
    		
        };
	//---------------end (function) update graph and summary-------------
	
	//---------------(layout) summary panel-------------
        var summaryArea = new Ext.chart.Panel({
		title: 'Summary',
		layout: {
			type: 'hbox',
			align: 'stretch'
		},
		id: 'summary',
		iconCls: 'summary',
		store: result1,
		scroll: 'vertical',
		items: []
	});
	//---------------end (layout) summary panel-------------
        
	//---------------(layout) graph panel-------------
	var myGraph = new Ext.chart.Panel({
        	title: 'Line Chart',
        	layout: 'fit',
	    	iconCls: 'line',
	    	iconMask: true,
        	id: 'newGraph',
        	items: [{
        	        cls: 'line1',
        	        store: store1,
        	        animate: true,
        	        shadow: true,
        	        legend: {
        	            position: 'right'
        	        },
        	        interactions: [{
        	        	type: 'panzoom',
        	            	axes: {
        	            	    left: {}
        	            	}
        	       	 }, {
        	           	type: 'iteminfo',
        	           	listeners: {
        	                	show: function(interaction, item, panel) {
        	               		
        	                	var storeItem = item.storeItem;
        	                	console.log(item);
        	                	panel.update(['<ul><li><b>Month: </b>' + storeItem.get('name') + '</li>', '<li><b>Value: </b> ' + item.value[1]+ '</li></ul>'].join(''));
        	               		}
        			}
               		}],
                	axes: [{
                    		type: 'Numeric',
                    		minimum: 0,
                    		position: 'left',
                    		fields: ['Home_Loan', 'Including_Interest'],
                    		title: 'Number of Hits',
                    		minorTickSteps: 1
                	}, {
                		type: 'Category',
                    		position: 'bottom',
                    		fields: ['name'],
                    		title: 'Years'
                	}],
                	series: [{
                    		type: 'line',
                    		fill: true,
                    		smooth: true,
                    		axis: 'left',
                    		xField: 'name',
                    		yField: 'Home_Loan'
                	}, {
                    		type: 'line',
                    		fill: true,
                    		axis: 'left',
                    		smooth: true,
                    		xField: 'name',
                    		yField: 'Including_Interest'
                	}]
            	}]
        });
	//---------------(layout) graph panel-------------
		
        
	//---------------(layout) all entries panels-------------
        var carpanel = new Ext.Carousel({
        	title: 'Input',
        	iconCls: 'input',
        	fullscreen: true,
        	layout: 'card',
            	dockedItems:[{
            		xtype: 'toolbar',
			dock: 'top',
			id: 'selection',
			items: [{
				xtype: 'selectfield',
				name: 'options',
				id: 'selection1',
				options: [
					{text: 'Normal', value: '1'},
					{text: 'Extra', value: '2'}
				],
				listeners: {
					change: function(){
						var y = Ext.getCmp('selection1').getValue();
						if (y=='1')
							carpanel.setActiveItem(0,{
								type: 'fade',
								duration: 1000
							});
						else
							carpanel.setActiveItem(1,{
								type: 'fade',
								duration: 1000
							});
					}
				}
			}]
        	}],
         	items: [normalRepayment,extraRepayment]
      	});
	//---------------end (layout) all entries panels-------------
        
	//---------------(layout) all panels-------------
	var tabpanel = new Ext.TabPanel({
		tabBar: {
        		dock: 'bottom',
        		layout: {
        			pack: 'center'
        		}
        	},
        	fullscreen: true,
         	cardSwitchAnimation: {
            	type: 'slide'
         	},
         	items: [carpanel,summaryArea,myGraph]
      	});
	//---------------end (layout) all panels-------------
    }
});
