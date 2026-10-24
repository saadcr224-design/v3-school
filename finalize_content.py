import json
from pathlib import Path
p=Path('dist/lessons.json');lessons=json.loads(p.read_text());outputs=json.loads(Path('example-results.json').read_text())
for l in lessons:
 l.update(outputs[str(l['id'])])
 if l['title']=='Command-line arguments':
  l['code']='#include <iostream>\n\nint main(int argc, char* argv[]) {\n    std::cout << "Argument count: " << argc << "\\n";\n    if (argc > 1) std::cout << "First argument: " << argv[1];\n}\n'
 if l['title']=='CMake targets' or l['id']==75:
  l['supportingCode']='cmake_minimum_required(VERSION 3.20)\nproject(Safar LANGUAGES CXX)\nadd_executable(safar main.cpp)\ntarget_compile_features(safar PRIVATE cxx_std_23)\n'
  l['supportingLabel']='CMakeLists.txt · local project configuration'
p.write_text(json.dumps(lessons,ensure_ascii=False,indent=2))
