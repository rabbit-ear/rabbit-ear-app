// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Manager, CustomMenuItem, Menu, MenuItem, Submenu, AboutMetadata};
// use lazy_static::lazy_static;
// use std::sync::Mutex;

// lazy_static! {
// 	static ref ARRAY: Mutex<Vec<u8>> = Mutex::new(vec![]);
// }
// fn do_a_call() {
// 	ARRAY.lock().unwrap().push(1);
// }


// lazy_static! {
// 	static ref ITEM_SHOW_FRAMES: Mutex<CustomMenuItem> = Mutex::new(CustomMenuItem::new(
// 		"show_frames".to_string(),
// 		"Show Frames"));
// }


fn main() {
	// let authors_list = vec!["Kraft".to_string()];
	// AboutMetadata {
	// 			version: Some("0.9".to_string()),
	// 			// authors: Option<Vec<String, Global>>,
	// 			authors: Some(authors_list),
	// 			comments: Some("comments".to_string()),
	// 			copyright: Some("2023".to_string()),
	// 			license: Some("OSC".to_string()),
	// 			website: Some("rabbitear.org".to_string()),
	// 			website_label: Some("Rabbit Ear".to_string()),
	// 		}

	// app menu items
	let mut about_metadata = AboutMetadata::new();
	about_metadata.version = Some("0.9".to_string());
	let item_quit = CustomMenuItem::new(
		"quit".to_string(),
		"Quit Rabbit Ear")
		.accelerator("cmdOrControl+Q");

	// file menu items
	let item_new = CustomMenuItem::new(
		"new".to_string(),
		"New")
		.accelerator("cmdOrControl+N");
	let item_new_frame = CustomMenuItem::new(
		"new_frame".to_string(),
		"New Frame")
		.accelerator("cmdOrControl+Shift+N");
	let item_open = CustomMenuItem::new(
		"open".to_string(),
		"Open")
		.accelerator("cmdOrControl+O");
	let item_save = CustomMenuItem::new(
		"save".to_string(),
		"Save")
		.accelerator("cmdOrControl+S");
	let item_save_as = CustomMenuItem::new(
		"save_as".to_string(),
		"Save As...")
		.accelerator("cmdOrControl+Shift+S");
	let item_import = CustomMenuItem::new(
		"import".to_string(),
		"Import");
	let item_export = CustomMenuItem::new(
		"export_as".to_string(),
		"Export As...")
		.accelerator("cmdOrControl+Alt+Shift+S");

	// edit menu items
	let item_undo = CustomMenuItem::new(
		"undo".to_string(),
		"Undo")
		.accelerator("cmdOrControl+Z");
	let item_redo = CustomMenuItem::new(
		"redo".to_string(),
		"Redo")
		.accelerator("cmdOrControl+Shift+Z");
	let item_duplicate = CustomMenuItem::new(
		"duplicate".to_string(),
		"Duplicate")
		.accelerator("shift+D");
	let item_delete = CustomMenuItem::new(
		"delete".to_string(),
		"Delete")
		.accelerator("Backspace");

	// graph menu items
	let item_planarize = CustomMenuItem::new(
		"planarize".to_string(),
		"Planarize")
		.accelerator("cmdOrControl+P");
	let item_flip_horiz = CustomMenuItem::new(
		"flip_horiz".to_string(),
		"Flip Horizontally");
	let item_flip_vert = CustomMenuItem::new(
		"flip_vert".to_string(),
		"Flip Vertically");
	let item_clean_verts = CustomMenuItem::new(
		"clean_verts".to_string(),
		"Clean vertices");
	let item_merge_near_verts = CustomMenuItem::new(
		"merge_near_verts".to_string(),
		"Merge nearby vertices");
	let item_snap_vertices = CustomMenuItem::new(
		"snap_vertices".to_string(),
		"Snap to grid");
	let item_merge_sel_verts = CustomMenuItem::new(
		"merge_sel_verts".to_string(),
		"Merge selected vertices");

	// select menu items
	let item_sel_all = CustomMenuItem::new(
		"select_all".to_string(),
		"Select All")
		.accelerator("cmdOrControl+A");
	let item_desel_all = CustomMenuItem::new(
		"deselect_all".to_string(),
		"Deselect All")
		.accelerator("cmdOrControl+D");
	let submenu_sel_assign = Submenu::new("Select Assignment", Menu::new()
		.add_item(CustomMenuItem::new("select_boundary".to_string(), "Boundary"))
		.add_item(CustomMenuItem::new("select_valley".to_string(), "Valley"))
		.add_item(CustomMenuItem::new("select_mountain".to_string(), "Mountain"))
		.add_item(CustomMenuItem::new("select_flat".to_string(), "Flat"))
		.add_item(CustomMenuItem::new("select_cut".to_string(), "Cut"))
		.add_item(CustomMenuItem::new("select_join".to_string(), "Join"))
		.add_item(CustomMenuItem::new("select_unassigned".to_string(), "Unassigned")));

	// assign menu items
	let item_rebuild_bound = CustomMenuItem::new(
		"rebuild_boundary".to_string(),
		"Rebuild boundary");
	let item_inv_assign = CustomMenuItem::new(
		"invert_assignments".to_string(),
		"Invert assignments");
	let submenu_assign_sel = Submenu::new("Reassign selected", Menu::new()
		.add_item(CustomMenuItem::new("reassign_boundary".to_string(), "Boundary"))
		.add_item(CustomMenuItem::new("reassign_valley".to_string(), "Valley"))
		.add_item(CustomMenuItem::new("reassign_mountain".to_string(), "Mountain"))
		.add_item(CustomMenuItem::new("reassign_flat".to_string(), "Flat"))
		.add_item(CustomMenuItem::new("reassign_cut".to_string(), "Cut"))
		.add_item(CustomMenuItem::new("reassign_join".to_string(), "Join"))
		.add_item(CustomMenuItem::new("reassign_unassigned".to_string(), "Unassigned")));

	// analysis menu items
	let item_flat_issues = CustomMenuItem::new(
		"flat_foldable_issues".to_string(),
		"Show/Hide Vertex Foldability Issues");
		//.selected();
	let item_show_indices = CustomMenuItem::new(
		"show_graph_indices".to_string(),
		"Show/Hide Graph Indices");
	let item_near_verts = CustomMenuItem::new(
		"nearest_two_vertices".to_string(),
		"Select Nearest two vertices");

	// window menu items
	let item_show_frames = CustomMenuItem::new(
		"show_frames".to_string(),
		"Show/Hide Frames");
	// let item_show_code_editor = CustomMenuItem::new(
	// 	"show_code_editor".to_string(),
	// 	"Show/Hide Code Editor");
	let item_show_axes = CustomMenuItem::new(
		"show_axes".to_string(),
		"Show/Hide Axes");
	let item_invert_vertical_axis = CustomMenuItem::new(
		"invert_vertical_axis".to_string(),
		"Invert Vertical Axis");

	let item_show_grid = CustomMenuItem::new(
		"show_grid".to_string(),
		"Show/Hide Grid");
	let item_set_grid_type_hex = CustomMenuItem::new(
		"grid_type_hex".to_string(),
		"Hex Grid");
	let item_set_grid_type_square = CustomMenuItem::new(
		"grid_type_square".to_string(),
		"Square Grid");

	// menus
	#[cfg(target_os = "macos")]
	let menu_app = Submenu::new("Rabbit Ear", Menu::new()
		.add_native_item(MenuItem::About("Rabbit Ear".to_string(), about_metadata))
		.add_native_item(MenuItem::Separator)
		.add_native_item(MenuItem::Services)
		.add_native_item(MenuItem::Separator)
		.add_native_item(MenuItem::Hide)
		.add_native_item(MenuItem::HideOthers)
		.add_native_item(MenuItem::ShowAll)
		.add_native_item(MenuItem::Separator)
		.add_item(item_quit));
		// .add_native_item(MenuItem::Quit));
	let menu_file = Submenu::new("File", Menu::new()
		.add_item(item_new)
		.add_item(item_new_frame)
		.add_native_item(MenuItem::Separator)
		.add_item(item_open)
		.add_native_item(MenuItem::Separator)
		.add_item(item_save)
		.add_item(item_save_as)
		.add_native_item(MenuItem::Separator)
		.add_item(item_import)
		.add_item(item_export));
	let menu_edit = Submenu::new("Edit", Menu::new()
		.add_item(item_undo)
		.add_item(item_redo)
		.add_native_item(MenuItem::Separator)
		.add_native_item(MenuItem::Copy)
		.add_native_item(MenuItem::Paste)
		.add_native_item(MenuItem::Separator)
		.add_item(item_duplicate)
		.add_item(item_delete));
	let menu_graph = Submenu::new("Graph", Menu::new()
		.add_item(item_planarize)
		.add_native_item(MenuItem::Separator)
		.add_item(item_flip_horiz)
		.add_item(item_flip_vert)
		.add_native_item(MenuItem::Separator)
		.add_item(item_clean_verts)
		.add_item(item_merge_near_verts)
		.add_item(item_snap_vertices)
		.add_item(item_merge_sel_verts));
	let menu_select = Submenu::new("Select", Menu::new()
		.add_item(item_sel_all)
		.add_item(item_desel_all)
		.add_submenu(submenu_sel_assign));
	let menu_assign = Submenu::new("Assignment", Menu::new()
		.add_item(item_rebuild_bound)
		.add_item(item_inv_assign)
		.add_submenu(submenu_assign_sel));
	let menu_analysis = Submenu::new("Analysis", Menu::new()
		.add_item(item_flat_issues)
		.add_item(item_show_indices)
		.add_native_item(MenuItem::Separator)
		.add_item(item_near_verts));
	let menu_window = Submenu::new("Window", Menu::new()
		.add_item(item_show_frames)
		// .add_item(item_show_code_editor)
		.add_item(item_show_axes)
		.add_item(item_invert_vertical_axis)
		.add_native_item(MenuItem::Separator)
		.add_item(item_show_grid)
		.add_item(item_set_grid_type_hex)
		.add_item(item_set_grid_type_square));

		// .add_item(ITEM_SHOW_FRAMES.lock().unwrap()));

	// the menu
	let menu = Menu::new()
		.add_submenu(menu_app)
		.add_submenu(menu_file)
		.add_submenu(menu_edit)
		.add_submenu(menu_graph)
		.add_submenu(menu_select)
		.add_submenu(menu_assign)
		.add_submenu(menu_analysis)
		.add_submenu(menu_window);

	tauri::Builder::default()
		.menu(menu)
		// .invoke_handler(tauri::generate_handler![save_as])
		.invoke_handler(tauri::generate_handler![store_boolean_update])
		.setup(|app| {
			#[cfg(debug_assertions)]
			app.get_window("main").unwrap().open_devtools();
			Ok(())
		})
		// .setup(|app| {
		// 	let main_window = app.get_window("main").unwrap();
		// 	let menu_handle = main_window.menu_handle();
		// 	std::thread::spawn(move || {
		// 		// you can also `set_selected`, `set_enabled` and `set_native_image` (macOS only).
		// 		menu_handle.get_item("item_id").set_title("New title");
		// 	});
		// 	Ok(())
		// })
		.on_menu_event(|event| {
			// let mut show_indices = false;

			// let main_window = app.get_window("main").unwrap();
			// let menu_handle = main_window.menu_handle();
			match event.menu_item_id() {
				// file
				// "new"
				// "open" => {
				// 	std::process::exit(0);
				// }
				"quit" => {
					let _ = event.window().eval("window.dialog.quit()");
					// std::process::exit(0);
				}
				"new" => {
					let _ = event.window().eval("window.dialog.newFile()");
				}
				"new_frame" => {
					let _ = event.window().eval("window.dialog.newFrame()");
				}
				"open" => {
					let _ = event.window().eval("window.fs.open()");
				}
				"save" => {
					let _ = event.window().eval("window.fs.save()");
				}
				"save_as" => {
					let _ = event.window().eval("window.fs.saveAs()");
				}
				"import" => {
					let _ = event.window().eval("window.dialog.importFile()");
				}
				"export_as" => {
					let _ = event.window().eval("window.dialog.exportAs()");
				}
				// "close" => {
				// 	event.window().close().unwrap();
				// }

				// edit
				"undo" => {
					let _ = event.window().eval("window.executeCommand('undo')");
				}
				"redo" => {
					let _ = event.window().eval("window.executeCommand('redo')");
				}
				"duplicate" => {
					let _ = event.window().eval("window.executeCommand('duplicate')");
					let _ = event.window().eval("window.executeCommand('setTool', 'translate')");
				}
				"delete" => {
					let _ = event.window().eval("window.execute('deleteComponents(getSelected())')");
					let _ = event.window().eval("window.executeCommand('setTool', 'translate')");
				}

				// graph
				"planarize" => {
					let _ = event.window().eval("window.executeCommand('planarize')");
				}
				"flip_horiz" => {
					let _ = event.window().eval("window.execute('scale(-1, 1)')");
				}
				"flip_vert" => {
					let _ = event.window().eval("window.execute('scale(1, -1)')");
				}
				"clean_verts" => {
					let _ = event.window().eval("window.executeCommand('cleanVertices')");
				}
				"merge_near_verts" => {
					let _ = event.window().eval("window.executeCommand('mergeNearbyVertices')");
				}
				"snap_vertices" => {
					let _ = event.window().eval("window.executeCommand('snapAllVertices')");
				}
				"merge_sel_verts" => {
					let _ = event.window().eval("window.executeCommand('mergeSelectedVertices')");
				}

				// assignment
				// todo: reassign fold angle: 45, 90, 135, 180
				"rebuild_boundary" => {
					let _ = event.window().eval("window['executeCommand']('rebuildBoundary')");
				}
				"invert_assignments" => {
					let _ = event.window().eval("window['executeCommand']('invertAssignments')");
				}
				"reassign_boundary" => {
					let _ = event.window().eval("window.execute('setAssignment(getSelectedEdges(), \"B\")')");
				}
				"reassign_valley" => {
					let _ = event.window().eval("window.execute('setAssignment(getSelectedEdges(), \"V\")')");
				}
				"reassign_mountain" => {
					let _ = event.window().eval("window.execute('setAssignment(getSelectedEdges(), \"M\")')");
				}
				"reassign_flat" => {
					let _ = event.window().eval("window.execute('setAssignment(getSelectedEdges(), \"F\")')");
				}
				"reassign_cut" => {
					let _ = event.window().eval("window.execute('setAssignment(getSelectedEdges(), \"C\")')");
				}
				"reassign_join" => {
					let _ = event.window().eval("window.execute('setAssignment(getSelectedEdges(), \"J\")')");
				}
				"reassign_unassigned" => {
					let _ = event.window().eval("window.execute('setAssignment(getSelectedEdges(), \"U\")')");
				}

				// selection
				// todo: select non-flat-folded fold angles
				"select_all" => {
					let _ = event.window().eval("window['executeCommand']('selectAll')");
				}
				"deselect_all" => {
					let _ = event.window().eval("window['executeCommand']('deselectAll')");
				}
				"select_boundary" => {
					let _ = event.window().eval("window['executeCommand']('selectEdgesWithAssignment', 'B')");
				}
				"select_valley" => {
					let _ = event.window().eval("window['executeCommand']('selectEdgesWithAssignment', 'V')");
				}
				"select_mountain" => {
					let _ = event.window().eval("window['executeCommand']('selectEdgesWithAssignment', 'M')");
				}
				"select_flat" => {
					let _ = event.window().eval("window['executeCommand']('selectEdgesWithAssignment', 'F')");
				}
				"select_cut" => {
					let _ = event.window().eval("window['executeCommand']('selectEdgesWithAssignment', 'C')");
				}
				"select_join" => {
					let _ = event.window().eval("window['executeCommand']('selectEdgesWithAssignment', 'J')");
				}
				"select_unassigned" => {
					let _ = event.window().eval("window['executeCommand']('selectEdgesWithAssignment', 'U')");
				}

				// analysis
				"flat_foldable_issues" => {
					let statement = format!("window.store.toggle('ShowFlatFoldableIssues')").to_string();
					let _ = event.window().eval(&statement);
				}
				"show_graph_indices" => {
					let statement = format!("window.store.toggle('ShowIndices')").to_string();
					let _ = event.window().eval(&statement);
				}
				"nearest_two_vertices" => {
					let statement = "window.execute('selectNearestVertices()')\nwindow.execute('setTool(\"select\")')".to_string();
					let _ = event.window().eval(&statement);
				}

				// window
				"show_frames" => {
					// ShowFrames
					let _ = event.window().eval("window.store.toggle('ShowFrames')");
					// println!("{:?}", eval_result);
					// match eval_result {
					// 	Ok(value) => println!("{:?}", value),
					// 	Err(e) => println!("error parsing header: {e:?}"),
					// }
					// item_show_frames.selected = true;

					// println!("Called {}", ARRAY.lock().unwrap().len());
				}
				// "show_code_editor" => {
				// 	let _ = event.window().eval("window.store.toggle('ShowCodeEditor')");
				// }
				"invert_vertical_axis" => {
					let _ = event.window().eval("window.store.toggle('VerticalUp')");
				}
				"show_grid" => {
					let _ = event.window().eval("window.store.toggle('ShowGrid')");
				}
				"grid_type_hex" => {
					let _ = event.window().eval("window.store.set('GridType','hex')");
				}
				"grid_type_square" => {
					let _ = event.window().eval("window.store.set('GridType','square')");
				}
				"show_axes" => {
					let _ = event.window().eval("window.store.toggle('ShowAxes')");
				}

				_ => {}
			}
		})
		// .invoke_handler(tauri::generate_handler![greet])
		.run(tauri::generate_context!())
		.expect("error while running tauri application");
}

// #[tauri::command]
// fn save(fold:String) {
// 	println!("{}", fold);
// }

// #[tauri::command]
// fn save_as(fold:String) {
// 	println!("{}", fold);
// }

#[tauri::command]
fn store_boolean_update(name:String, value:bool) {
	println!("'{}': {:?}", name, value);
	match name.as_str() {
		// "ShowFrames" => item_show_frames.selected = value,
		_ => println!("RUST store boolean update callback"),
	}
}
