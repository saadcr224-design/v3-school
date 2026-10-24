import subprocess,sys
for script in ['expand_curriculum.py','add_topics.py','finalize_content.py']:
 subprocess.run([sys.executable,script],check=True)
