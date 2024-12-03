import os
import codecs

filetypes = 'ts tsx js'


def count_lines(filename, chunk_size=1 << 13):
    with codecs.open(filename, "r", "utf_8_sig") as file:
        return sum(chunk.count('\n')
                   for chunk in iter(lambda: file.read(chunk_size), ''))
       
       
if __name__ == '__main__':
    filelist = []
    filelines = {}
    for filetype in filetypes.split():
        filelines[filetype] = 0
    
    for root, dirs, files in os.walk(os.getcwd()):
        for file in files:
            filelist.append(os.path.join(root, file))
            
    for file in filelist:
        if not file.endswith('line_counter.py'):
            if file.split('.')[-1] in filetypes.split():
                filelines[file.split('.')[-1]] += count_lines(file) + 1
            
    for filetype, lines in filelines.items():
        print(filetype + ' - ' + str(lines))
    print('total: ' + str(sum(filelines.values())))
    input()
