<?php
	//include_once(DIR_BASE.'calendar/inc/functions.php');
	
	//$notification = FALSE;
	//if(checkStories() > 0) {
		//$notification = TRUE;
	//}
?>


<div class="nav-wrap">
    <nav id="top">
        <ul>
            <li><a href="/"><i class="fa fa-angle-right"></i>Home</a></li>
            
            <li class="addnew">
                <a href="/index.php?view=admin"><i class="fa fa-angle-right"></i>New</a>
            </li>
            
            <li class="listlink">
                <a href="/index.php?view=list"><i class="fa fa-angle-right"></i>List of Misses</a>
            </li>
            
            <li class="callink <?php //echo $notification == TRUE ? 'newStory': '' ?>">
            	<a href="/index.php?view=calendar"><i class="fa fa-angle-right"></i>Calendar</a>
                
                <?php //if($notification) : ?>
                	<!-- span class="notification">(<?php //echo checkStories(); ?> New)</span>-->
                <?php //endif; ?>
            </li>
            
            <li class="msglink">
                <a href="/index.php?view=conversations"><i class="fa fa-angle-right"></i>Conversations</a>
            </li>
            
			<?php if(isset($_SESSION['user_id']) && $_SESSION['user_id'] > 0): ?>
            	<li class="logout"><a href="/index.php?view=login"><i class="fa fa-angle-right"></i>Logout</a></li>
            <?php endif; ?>
        </ul>
    </nav>
    
    <div class="expander"><i class="fa fa-bars"></i></div>
</div>