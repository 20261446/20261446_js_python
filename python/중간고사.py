x = 3.141592
print(int(x))

a = 17 // 4
b = 17 % 4
print(a, b)

a = int(input("정수를 입력하세요: "))
b = 200
print(a + b)

print('python','Java',sep='-',end='!!')
print('C++')

score = 85
if score >= 90:
    print('A')
elif score >= 80:
    print('B')
elif score >= 70:
    print('C')
else:
    print('F')


total = 0
for i in range(1, 6):
    if i % 2 == 0:
        continue
total += i
print(total)

s = 'PythonProgramming'
print(s[2:9])

data = [10, 20, 30]
data.append(40)
data.insert(1, 15)
data[1] = 500
data.pop()
print(data) # 결과값이 [10, 500, 20, 30]


student = {'name': '김철수', 'age': 20}
print(student.get('major','컴퓨터공학'))


count = 0
n = 10

while n > 0:
    if n == 4:
        break
    if n % 3 == 0:
        count += 1        
    n -= 1
print(count)


x = 10
result = 'Pass' if x >= 10 and x % 2 == 1 else 'Fail'
print(result) #결과값이 'Fail'

text = 'Python Programming '
result = text.strip().upper().replace('PYTHON', 'AI')
print(result)

numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 16, 20]
even_numbers = [x for x in numbers if x % 4 == 0]
print(even_numbers) # 결과값이 [4, 8, 12, 16, 20]

def func(*args, **kwargs):
    return len(args) + len(kwargs)
print(func(1, 2, 3, a=4, b=5))



g_var = 10
def update_var():
    global g_var
    g_var += 5
    return g_var

update_var()
print(g_var)



import copy
a = [[1, 2], [3, 4]]
b = a.copy()
b[0][0] = 99
print(a[0][0], b[0][0])