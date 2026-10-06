#for i in range(0, 2, 1):
#    print("안녕하세요? for 문을 공부중입니다.")

#for i in range(1, 100, 2):
#    print("%d" %i, end="")

#for i in range(2, 100, 2):
#    print("%d" %i, end="")

# i, hap = 0, 0

# for i in range(1,11,1):
#     hap=hap+i

# print("1에서10까지의 합계 : %d" %hap)

# i, hap = 0, 0

# for i in range(1,100,2):

#     hap=hap+i

# print("1에서100까지의 홀수 합계 : %d" %hap)

# i, hap = 0, 0

# for i in range(2,100,2):

#     hap=hap+i

# print("1에서100까지의 짝수 합계 : %d" %hap)

# i, dan = 0, 0

# dan = int(input("단을 입력하세요."))

# for i in range(1, 10, 1):
#     print("%d X %d = %2d"%(dan, i, dan*i))

# for i in range(0, 3, 1):
#     for k in range(0, 2, 1):
#         print("파이썬은 꿀잼입니다. (i값 : %d, k값 : %d)"%(i, k))


i, k, a = 0, 0, ""


for i in range(2, 10 ,1):

    a=a+("   # %d단 #  " % i)

print(a)

for i in range(1, 10 ,1):
    a=""        
    for k in range(2, 10 , 1):
        a=a+str("%2d X %2d = %2d" % (k, i, k*i))
    print(a)


a=0

for a in range(1, 51, 1):
    print("*" * ａ)



b=0

for b in range(50, 0, -2):
    print(" " * ((50 - b) // 2) + "*" * b)

for b in range(2, 51, 2):
    print(" " * ((50 - b) // 2) + "*" * b)





    

# i, dan = 0, 0

# for dan in range(9, 1 ,-1):
    # if dan==2:
    #     print("###2단###")
    # if dan==3:
    #     print("###3단###")
    # if dan==4:
    #     print("###4단###")
    # if dan==5:
    #     print("###5단###")
    # if dan==6:
    #     print("###6단###")
    # if dan==7:
    #     print("###7단###")
    # if dan==8:
    #     print("###8단###")
    # if dan==9:
    #     print("###9단###")
#     for i in range(1 ,10, 1):
        
#         print("%d X %d = %2d" % (dan, i, dan*i))



# i, hap = 0, 0

# i = 1
# while i<11:
#     hap = hap + i
#     i = i + 1

# print("1에서 10까지의 합계 : %d"%hap)

# # while True:
# #     print("ㅋ", end="")

# for i in range(1,100):
#     print("for문을 %d번 실행했습니다." % i)
#     break

# hap = 0
# a, b = 0, 0

# while True :
#     a=int(input("더할 첫 번째 수를 입력하세요 : "))
#     if a == 0:
#         break
#     b=int(input("더할 두 번째 수를 입력하세요 : "))
#     hap = a+b
    
#     print("%d + %d = %d" % (a,b,hap))

# print("0을 입력해 반복문을 탈출했습니다.")


# hap, i =0,0

# for i in range(1, 101):
#     if i % 3==0:
#         continue

#     hap += i
# print("1~100의 합계 (3의배수 제외) : %d" % hap)