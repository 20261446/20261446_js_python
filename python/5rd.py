# a=9
# b=2

# print(a//b) 몫
# print(a%b) 나머지
# print(a**b) 제곱

# a+=3;print(a)
# a-=3;print(a)
# a*=3;print(a)
# a/=3;print(a)
# a%=3;print(a)
# a**=3;print(a)

# print(a==b , a!=b , a>b , a<b , a>=b , a<=b)

# s1, s2, s3= "100", "100.123", "99999999999999999"
# print(int(s1)+1,"\n",float(s2)+1,"\n",int(s3)+1)






# money, c500, c100, c50, c10=0,0,0,0,0

# money=int(input("교환할 돈은 얼마?"))

# c500=money//500
# money%=500

# c100=money//100
# money%=100

# c50=money//50
# money%=50

# c10=money//10
# money%=10

# print("\n 500원짜리 ==>%d개" %c500)
# print("100원짜리 ==>%d개" %c100)
# print("50원짜리 ==>%d개" %c50)
# print("10원짜리 ==>%d개" %c10)
# print("바꾸지 못한 잔돈 ==>%d원 \n" %money)





money, c10000, c5000, c1000=0,0,0,0

money=int(input("교환할 돈은 얼마?"))

c10000=money//10000
money%=10000

c5000=money//5000
money%=5000

c1000=money//1000
money%=1000

print("\n 10000원짜리 ==>%d개" %c10000)
print("5000원짜리 ==>%d개" %c5000)
print("1000원짜리 ==>%d개" %c1000)
print("바꾸지 못한 잔돈 ==>%d원 \n" %money)





a=200

if a<100:
    print("100보다 작군요")
    print("거짓이므로 이 문장은 안 보이겠죠")

print("프로그램 끝")



a=int(input("정수를 입력하세요:"))

if a%2==0:
    print("짝수를 입력했군요.")
else:
    print("홀수를 입력했군요.")






a=75

if a >50:
    if a <100:
        print("50보다 크고 100보다 작군요.")
    else:
        print("와~~100보다 크군요.")
else:
    print("에고~50보다 작군요.")





# score = int(input("점수를 입력하세요 :"))

# if score >=90:
#     print("A")
# else:
#     if score >=80:
#         print("B")
#     else:
#         if score >=70 :
#             print("C")
#         else :
#             if score >=60:
#                 print("D")
#             else:
#                 print("F")
# print("학점입니다.^^")


score = int(input("점수를 입력하세요 :"))

if score >=95:
    print("A+")
else:
    if score >=90:
        print("A0")
    else:
        if score >=85 :
            print("B+")
        else :
            if score >=80:
                print("B0")
            else:
                if score >=75 :
                    print("C+")
                else :
                     if score >=70 :
                        print("C0")
                     else :
                        if score >=65 :
                            print("D+")
                        else :
                            if score >=60 :
                                print("D0")
                            else :
                                print("F")
                
print("학점입니다.^^")
