
#mfunc GMEditLog(msg) GMEdit.Log({file: @@__FILE__, line: @@__LINE__, context: @@__HERE__, level: "log"},msg);
#mfunc GMEditError(msg) GMEdit.Log({file: @@__FILE__, line: @@__LINE__, context: @@__HERE__, level: "error"},msg);
#mfunc GMEditWarn(msg) GMEdit.Log({file: @@__FILE__, line: @@__LINE__, context: @@__HERE__,level: "warn"},msg);
#mfunc GMEditDebug(msg) GMEdit.Log({file: @@__FILE__, line: @@__LINE__, context: @@__HERE__, level: "debug"},msg);

enum GMEditModule {
  MConsole,
}

enum GMEditConsoleEvent {
  Log,
  Surface,
}

function lib_GMEdit(ip: string, port: number) constructor{

	socket = network_create_socket(network_socket_ws);
	
	buff = buffer_create(1,buffer_grow, 1);
	
	network_connect_raw_async(socket, ip, port);
	
	static async_network_event = function(){
		
		if(async_load[? "id"] == socket){
			
			switch(async_load[? "type"]){
				case network_type_non_blocking_connect:{
					
						show_debug_message("Connected!");
						obj_GMEdit.Tests();
					
					break;
				}
				
				case network_type_data: {
					var buffer = async_load[? "buffer"];
					show_debug_message(buffer_read(buffer,buffer_text));
					break;
				}
				
			}
			
		}
		
	}
	
	static send = function(){
		network_send_raw(socket, buff, buffer_tell(buff));
	};
	
	static Log = function(context, value){
		
		context[$ "type"] = typeof(value);
		context[$ "class"] = instanceof(value);
		
		switch(context.type){
			
			case "function": {
				
				value = string(value);
				
				break;
			}
			
			case "method": {
				
				value = string(value);
				
				break;
			}
			
			case "struct": {
				
				if(value[$ GMEditSymbol] == undefined){
					value = self.Pack(value);
				}
				
				break;
			}
			
		}
		
		buffer_seek(self.buff, buffer_seek_start, 0);
		buffer_write(self.buff, buffer_u8, GMEditModule.MConsole);
		buffer_write(self.buff, buffer_u8, GMEditConsoleEvent.Log);
		buffer_write(self.buff, buffer_string, json_stringify({context: context,message: value}));
		self.send();
	
	}
	
	static Surface = function(surf:surface){
		
		buffer_seek(self.buff, buffer_seek_start, 0);
		buffer_write(self.buff, buffer_u8, GMEditModule.MConsole);
		buffer_write(self.buff, buffer_u8, GMEditConsoleEvent.Surface);
		buffer_write(self.buff, buffer_u16, surface_get_width(surf));
		buffer_write(self.buff, buffer_u16, surface_get_height(surf));
		buffer_get_surface(self.buff, surf, buffer_tell(self.buff));
		self.send();
		
	}
	
	static Sprite = function(spr: sprite, index: number = 0){
		
		var surf = surface_create(sprite_get_width(spr), sprite_get_height(spr));
		surface_set_target(surf);
		draw_sprite(spr, index, 0, 0);
		surface_reset_target()
		self.Surface(surf);
		surface_free(surf);
		
	}
	
	static Pack = function(value, _depth = 2){
		
		#macro GMEditSymbol "__SYMBOL__"
		
		switch(typeof(value)){
			case "struct": {
				var names = variable_struct_get_names(value);
				if(_depth > 0){
					
					var obj = {};
					
					for(var i = 0; i < array_length(names); i++){
						obj[$ names[i]] = Pack(value[$ names[i]], _depth - 1);
					}
					
					return {
						GMEditSymbol: {
							value: obj,
							type: typeof(value),
							size: array_length(names),
							class: instanceof(value)
						}
					};
					};
				}		
				
				return {
					GMEditSymbol: {
						value: {},
						type: typeof(value),
						size: array_length(names),
						class: instanceof(value)
					}
				};
				
				break;
			case "array": {
				
				if(_depth > 0){
					
					var list = [];
					
					for(var i = 0;i < array_length(value); i++){
						list[i] = Pack(value[i], _depth - 1);
					}
					
					return {
						GMEditSymbol: {
							value: list,
							size: array_length(value),
							type: "array"
						}
					}
					
				}
				
				return {
					GMEditSymbol: {
						value: [],
						size: array_length(value),
						type: "array"
					}
				}
				
				break;
			}
			
			default: {
				return {
					GMEditSymbol: {
						value: value,
						type: typeof(value)
					}
				}
			}
		}
		
	}
}

