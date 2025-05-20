package com.tecsup.back_springboot_srvt.service;

import com.tecsup.back_springboot_srvt.dao.AulaVirtualDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AulaVirtualServiceImpl implements AulaVirtualService{

    private final AulaVirtualDAO aulaVirtualDAO;

    @Autowired
    public AulaVirtualServiceImpl(AulaVirtualDAO aulaVirtualDAO) {
        this.aulaVirtualDAO = aulaVirtualDAO;
    }

    @Autowired


}
