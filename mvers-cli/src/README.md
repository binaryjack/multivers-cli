| Project   | Author      | Version |
| :-------- | :---------- | :-----: |
| MVERS-CLI | Tadeo Piana |  V.01   |

# Description

Version manager tool

## in order to use the tool you must install it if it's not yet the case

`npm install mvers-cli -g`

#### in order to invloke the tool use the <`mvr`> command

---

## commands

| Command name  |       Options       | Descriptions                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| :------------ | :-----------------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| builder       |        'N/A'        | Creates the initial file: 'raw_files.json' and 'dependencies.json' file which contains all project interesting files.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| deps          | -c <br> -sw <br> -r | Generate dependency `html` files in `relations` folders generaly there is only the root component file with dependencies. If you want to navigate toward others childs components you must append -r(recursively) to the command.: .<br> options: <br> -c or -component ' \<componentName\>' <br> -sw or -searchWhere [searchWhere] <br> values can be: <br> - name: the strict names<br> - fullName.contains: all files path that contains the given string.<br> - fullName: strictly the full path.<br> - r or recursively: will loop each import of the root givent component and extract it's related dependencies |
| v-up / v-down |     -c<br> -sw      | build the version file 'versions.json' if not exists then prepare upgrade or downgrade versions. this will not apply the changes on the project files yet. it's just preparation phase.                                                                                                                                                                                                                                                                                                                                                                                                                                |
| update        |                     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| current-v     |                     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| clear-v       |                     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| clear         |                     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| flat          |                     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |

---

## samples commands

-   `mvr build`

-   `mvr deps -c home\pages\Home.tsx -r`

-   `mvr v-up -c home\pages\Home.tsx`

-   `mvr v-down -c home\pages\Home.tsx`

-   `mvr update -c home\pages\Home.tsx`

-   `mvr current-v -c home\pages\Home.tsx`

-   `mvr clear-v -c home\pages\Home.tsx`

-   `mvr clear -c home\pages\Home.tsx`

-   `mvr flat -c home\pages\Home.tsx`

-   mvr deps -b C:/Users/pianat/source/repos/customer-portal -c home\pages\Home.tsx -r
