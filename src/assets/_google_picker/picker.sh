AUTH="Authorization: Bearer ya29.GlxyBUsaLhktya8NEPw1mzGv9aEL_dRvsLN1opdOHqDUfeMcH3_otEEKGjkLweM4pbW-_UQ3KYPsIsLbRzBWFm29DxxfTwI165A4_NkuRG1fEIJIUFRyzdq4FNAYcA"
DRIVE="https://content.googleapis.com/drive/v3/files"
OBJ_ID="1VEhEKadAsub80HczNWZk8yAM4ma6FAcp"
URL="${DRIVE}/${OBJ_ID}?alt=media"

 curl -v -H "$(cat headers)" -H "${AUTH}" "${URL}"  |zcat |base64 --decode
