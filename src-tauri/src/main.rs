// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{CustomMenuItem, Menu, MenuItem, Submenu, AboutMetadata};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
// #[tauri::command]
// fn greet(name: &str) -> String {
// 	format!("Hello, {}! You've been greeted from Rust!", name)
// }

fn main() {
	// let authors_list = vec!["Kraft".to_string()];
	let mut about_metadata = AboutMetadata::new();
	about_metadata.version = Some("0.9".to_string());
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
	#[cfg(target_os = "macos")]
  let app_menu = Submenu::new(
    "Rabbit Ear",
    Menu::new()
      .add_native_item(MenuItem::About("Rabbit Ear".to_string(), about_metadata))
      .add_native_item(MenuItem::Separator)
      .add_native_item(MenuItem::Services)
      .add_native_item(MenuItem::Separator)
      .add_native_item(MenuItem::Hide)
      .add_native_item(MenuItem::HideOthers)
      .add_native_item(MenuItem::ShowAll)
      .add_native_item(MenuItem::Separator)
      .add_native_item(MenuItem::Quit)
  );

	// CustomMenuItem::new(menu item id, menu item label)
	let new_menu = CustomMenuItem::new("new".to_string(), "New");
	let open = CustomMenuItem::new("open".to_string(), "Open");
	let save_as = CustomMenuItem::new("save_as".to_string(), "Save As...");
	let import = CustomMenuItem::new("import".to_string(), "Import");
	let export = CustomMenuItem::new("export".to_string(), "Export As...");
	let file_menu = Submenu::new("File", Menu::new()
		.add_item(new_menu)
		.add_item(open)
		.add_native_item(MenuItem::Separator)
		.add_item(save_as)
		.add_native_item(MenuItem::Separator)
		.add_item(import)
		.add_item(export));

	// let undo = CustomMenuItem::new("undo".to_string(), "Undo");
	// let redo = CustomMenuItem::new("redo".to_string(), "Redo");
	let duplicate = CustomMenuItem::new("duplicate".to_string(), "Duplicate").accelerator("shift+D");
	let edit_menu = Submenu::new("Edit", Menu::new()
		// .add_item(undo)
		// .add_item(redo)
		.add_native_item(MenuItem::Undo)
		.add_native_item(MenuItem::Redo)
		.add_native_item(MenuItem::Separator)
		.add_item(duplicate));

	let planarize = CustomMenuItem::new("planarize".to_string(), "Planarize").accelerator("cmdOrControl+P");
	let clean_verts = CustomMenuItem::new("clean_verts".to_string(), "Smart clean vertices");
	let merge_near_verts = CustomMenuItem::new("merge_near_verts".to_string(), "Merge nearby vertices");
	let snap_vertices = CustomMenuItem::new("snap_vertices".to_string(), "Snap to grid");
	let merge_sel_verts = CustomMenuItem::new("merge_sel_verts".to_string(), "Merge selected vertices");
	let newmenu = CustomMenuItem::new("newmenu".to_string(), "newmenu");
	let graph_menu = Submenu::new("Graph", Menu::new()
		.add_item(planarize)
		.add_native_item(MenuItem::Separator)
		.add_item(clean_verts)
		.add_item(merge_near_verts)
		.add_item(snap_vertices)
		.add_item(merge_sel_verts));

	let sel_all = CustomMenuItem::new("select_all".to_string(), "Select All").accelerator("cmdOrControl+S");
	let desel_all = CustomMenuItem::new("deselect_all".to_string(), "Deselect All").accelerator("cmdOrControl+D");
	let sel_assign = Submenu::new("Select Assignment", Menu::new()
		.add_item(CustomMenuItem::new("select_boundary".to_string(), "Boundary"))
		.add_item(CustomMenuItem::new("select_valley".to_string(), "Valley"))
		.add_item(CustomMenuItem::new("select_mountain".to_string(), "Mountain"))
		.add_item(CustomMenuItem::new("select_flat".to_string(), "Flat"))
		.add_item(CustomMenuItem::new("select_cut".to_string(), "Cut"))
		.add_item(CustomMenuItem::new("select_join".to_string(), "Join"))
		.add_item(CustomMenuItem::new("select_unassigned".to_string(), "Unassigned")));
	let select_menu = Submenu::new("Select", Menu::new()
		.add_item(sel_all)
		.add_item(desel_all)
		.add_submenu(sel_assign));

	let rebuild_bound = CustomMenuItem::new("rebuild_boundary".to_string(), "Rebuild boundary");
	let inv_assign = CustomMenuItem::new("invert_assignments".to_string(), "Invert assignments");
	let assign_sel = Submenu::new("Reassign selected", Menu::new()
		.add_item(CustomMenuItem::new("reassign_boundary".to_string(), "Boundary"))
		.add_item(CustomMenuItem::new("reassign_valley".to_string(), "Valley"))
		.add_item(CustomMenuItem::new("reassign_mountain".to_string(), "Mountain"))
		.add_item(CustomMenuItem::new("reassign_flat".to_string(), "Flat"))
		.add_item(CustomMenuItem::new("reassign_cut".to_string(), "Cut"))
		.add_item(CustomMenuItem::new("reassign_join".to_string(), "Join"))
		.add_item(CustomMenuItem::new("reassign_unassigned".to_string(), "Unassigned")));
	let assign_menu = Submenu::new("Assignment", Menu::new()
		.add_item(rebuild_bound)
		.add_item(inv_assign)
		.add_submenu(assign_sel));

	let flat_issues = CustomMenuItem::new("flat_foldable_issues".to_string(), "Flat-Foldable Issues").selected();
	let near_verts = CustomMenuItem::new("nearest_two_vertices".to_string(), "Nearest two vertices");
	let show_indices = CustomMenuItem::new("show_graph_indices".to_string(), "Show Graph Indices");
	let analysis_menu = Submenu::new("Analysis", Menu::new()
		.add_item(flat_issues)
		.add_item(near_verts)
		.add_item(show_indices));

	let show_frames = CustomMenuItem::new("show_frames".to_string(), "Show Frames").selected();
	let window_menu = Submenu::new("Window", Menu::new()
		.add_item(show_frames));

	// let a = CustomMenuItem::new("".to_string(), "");
	// let b = CustomMenuItem::new("".to_string(), "");
	// let c = CustomMenuItem::new("".to_string(), "");
	// let d = CustomMenuItem::new("".to_string(), "");
	// let e = CustomMenuItem::new("".to_string(), "");
	// let f = CustomMenuItem::new("".to_string(), "");
	// let m = Submenu::new("MENU", Menu::new()
	// 	.add_item(a)
	// 	.add_item(b)
	// 	.add_item(c)
	// 	.add_item(d)
	// 	.add_item(e)
	// 	.add_item(f));

	let menu = Menu::new()
    .add_submenu(app_menu)
		.add_submenu(file_menu)
		.add_submenu(edit_menu)
		.add_submenu(graph_menu)
		.add_submenu(select_menu)
		.add_submenu(assign_menu)
		.add_submenu(analysis_menu)
		.add_submenu(window_menu);

	tauri::Builder::default()
		.menu(menu)
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
			match event.menu_item_id() {
				// file
				// "new"
				// "open" => {
				// 	std::process::exit(0);
				// }
				// "save_as"
				"quit" => {
					std::process::exit(0);
				}
				// "close" => {
				// 	event.window().close().unwrap();
				// }

				// edit
				// "undo" => {
				// 	event.window().eval("window['executeCommand']('undo')");
				// }
				// "redo" => {
				// 	event.window().eval("window['executeCommand']('redo')");
				// }
				"duplicate" => {
					event.window().eval("window['executeCommand']('duplicate')");
					event.window().eval("window['executeCommand']('setTool', 'translate')");
				}

				// graph
				"planarize" => {
					event.window().eval("window['executeCommand']('planarize')");
				}
				"clean_verts" => {
					event.window().eval("window['executeCommand']('cleanVertices')");
				}
				"merge_near_verts" => {
					event.window().eval("window['executeCommand']('mergeNearbyVertices')");
				}
				"snap_vertices" => {
					event.window().eval("window['executeCommand']('snapAllVertices')");
				}
				"merge_sel_verts" => {
					event.window().eval("window['executeCommand']('mergeSelectedVertices')");
				}

				// assignment
				"rebuild_boundary" => {
					event.window().eval("window['executeCommand']('rebuildBoundary')");
				}
				"invert_assignments" => {
					event.window().eval("window['executeCommand']('invertAssignments')");
				}
				"reassign_boundary" => {
					event.window().eval("window['execute']('setAssignment(getSelectedEdges(), 'B')')");
				}
				"reassign_valley" => {
					event.window().eval("window['execute']('setAssignment(getSelectedEdges(), 'V')')");
				}
				"reassign_mountain" => {
					event.window().eval("window['execute']('setAssignment(getSelectedEdges(), 'M')')");
				}
				"reassign_flat" => {
					event.window().eval("window['execute']('setAssignment(getSelectedEdges(), 'F')')");
				}
				"reassign_cut" => {
					event.window().eval("window['execute']('setAssignment(getSelectedEdges(), 'C')')");
				}
				"reassign_join" => {
					event.window().eval("window['execute']('setAssignment(getSelectedEdges(), 'J')')");
				}
				"reassign_unassigned" => {
					event.window().eval("window['execute']('setAssignment(getSelectedEdges(), 'U')')");
				}

				// selection
				"select_all" => {
					event.window().eval("window['executeCommand']('selectAll')");
				}
				"deselect_all" => {
					event.window().eval("window['executeCommand']('deselectAll')");
				}
				"select_boundary" => {
					event.window().eval("window['executeCommand']('selectEdgesWithAssignment', 'B')");
				}
				"select_valley" => {
					event.window().eval("window['executeCommand']('selectEdgesWithAssignment', 'V')");
				}
				"select_mountain" => {
					event.window().eval("window['executeCommand']('selectEdgesWithAssignment', 'M')");
				}
				"select_flat" => {
					event.window().eval("window['executeCommand']('selectEdgesWithAssignment', 'F')");
				}
				"select_cut" => {
					event.window().eval("window['executeCommand']('selectEdgesWithAssignment', 'C')");
				}
				"select_join" => {
					event.window().eval("window['executeCommand']('selectEdgesWithAssignment', 'J')");
				}
				"select_unassigned" => {
					event.window().eval("window['executeCommand']('selectEdgesWithAssignment', 'U')");
				}

				// analysis
				"flat_foldable_issues" => {
					// ShowFlatFoldableIssues
				}
				"nearest_two_vertices" => {
					event.window().eval("window['executeCommand']('selectNearestVertices')");
				}
				"show_graph_indices" => {
					// ShowIndices
				}

				// window
				"show_frames" => {
					// ShowFrames
					// event.window().eval("window['executeCommand']('selectNearestVertices')");
				}

				_ => {}
			}
		})
		// .invoke_handler(tauri::generate_handler![greet])
		.run(tauri::generate_context!())
		.expect("error while running tauri application");
}
