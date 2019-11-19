<script>
     
     $(document).ready(function(){
          
          $(window).scroll(function(){

            if($(window).scrollTop()>300){
              $('nav').addClass('red');
            }else{
              $('nav').removeClass('red');
            }

          })

     });

  </script>