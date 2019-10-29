<?php 

namespace App\Events;

use Symfony\Component\HttpKernel\Event\GetResponseForControllerResultEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use ApiPlatform\Core\EventListener\EventPriorities;
use Symfony\Component\HttpKernel\KernelEvents;
use App\Entity\User;


class PasswordEncoderSubscriber implements EventSubscriberInterface {

    private $encoder;

    public function __construct(UserPasswordEncoderInterface $encoder){
        $this->encoder = $encoder;
    }
   
    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['encodePassword', EventPriorities::PRE_WRITE]
        ];
    }

    public function encodePassword(GetResponseForControllerResultEvent $event){
       $user = $event->getControllerResult();
       $method = $event->getRequest()->getMethod();

       if($user instanceof User && $method === "POST"){
           $hash =$this->encoder->encodePassword($user, $user->getPassword());
           $user->setPassword($hash);
       }
    }
}