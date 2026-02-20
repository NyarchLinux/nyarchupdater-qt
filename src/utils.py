def spawn(command, cwd=None):
    """Spawns a command and returns the output as a string."""
    import subprocess

    result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, cwd=cwd)
    if result.returncode != 0:
        raise RuntimeError(f"Command '{' '.join(command)}' failed with error: {result.stderr}")
    return result.stdout.strip()