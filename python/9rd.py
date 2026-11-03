def plus(v1,v2):
    result = 0
    result = v1 + v2
    return result

hap = 0

hap = plus(100,200)
print("100과 200의 plus() 함수 결과는 %d" % hap)



def para_func(*para):
    result = 0
    for num in para:
        result = result + num
    return result

hap = 0

hap = para_func(10,20)
print("매개변수가 2개인 함수를 호출한 결과 ==> %d" % hap)
hap = para_func(10,20,30)
print("매개변수가 3개인 함수를 호출한 결과 ==> %d" % hap)




